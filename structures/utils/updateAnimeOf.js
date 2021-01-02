'use strict'

const database = require('../database')
const tmdb = require('../tmdb')
const config = require('../../config')
const createLogger = require('./createLogger')
const searchTMDBRecursively = require('./searchTMDBRecursively')

const debug = createLogger('utils/updateAnimeOf')

module.exports = async opts => {
  'use strict'

  const {
    name = '',
    exQuery,
    extendData = {}
  } = (opts || {})

  if (!name) return -1

  // NOTE: get knex instance after initiating process;
  const { knex } = database

  // NOTE: search the title;
  const [search] = await searchTMDBRecursively(name)

  if (!search) return -1

  const [ex] = await knex('anime')
    .select('id', 'updatedAt')
    .where(exQuery || { scheduleName: name })

  // NOTE: skip updating data which recently updated;
  if (ex && (ex.updatedAt + config.ohys.getDataOfScheduleIn > Date.now())) {
    debug('skipping data update for anime:', name)

    return ex.id
  }

  // NOTE: get detailed information;
  const details = await tmdb.query('/tv/' + search.id)
  const { translations } = await tmdb.query('/tv/' + search.id + '/translations')

  // NOTE: fill optional values;
  if (!details.networks || !details.networks.length) details.networks = [{ name: 'unavailable' }]

  // NOTE: pre-define anime id to update;
  let id

  // NOTE: process detailed information of anime;
  if (ex) {
    id = ex.id

    debug('updating anime metadata:', id)

    await knex('anime')
      .update({
        updatedAt: Date.now(),
        name: details.name,
        network: details.networks[0].name,
        status: details.status,
        backdropImage: details.backdrop_path,
        posterImage: details.poster_path,
        ...extendData
      })
      .where({
        id
      })
  } else {
    debug('inserting new anime metadata')

    id = await knex('anime')
      .returning('id')
      .insert({
        updatedAt: Date.now(),
        name: details.name,
        scheduleName: name,
        network: details.networks[0].name,
        status: details.status,
        backdropImage: details.backdrop_path,
        posterImage: details.poster_path,
        ...extendData
      })

    debug('inserted new anime metadata to:', id)

    // NOTE: fill id;
    id = id[0]
  }

  let exTranslations = await knex('anime_details')
    .select('id', 'language', 'name', 'overview')
    .where({
      animeId: id
    })

  // NOTE: process the translations of anime;
  const translationsToInsert = []

  // NOTE: serialize the exTranslation to improve performance;
  const exTranslationLanguages = exTranslations.map(exTranslation => exTranslation.language)
  const exTranslationSerialized = {}

  for (let n = 0, z = exTranslationLanguages.length; n < z; n++) {
    exTranslationSerialized[exTranslationLanguages[n]] = exTranslations[n]
  }

  exTranslations = exTranslationSerialized

  for (let n = 0, z = translations.length; n < z; n++) {
    const translation = translations[n]
    const previousTranslation = exTranslations[translation.iso_639_1]

    if (previousTranslation) {
      if (
        (previousTranslation.name === translation.data.name) &&
        (previousTranslation.overview === translation.data.overview)
      ) continue

      debug('updating translation for anime:', id, '/language:', previousTranslation.language)

      await knex('anime_details')
        .update({
          updatedAt: Date.now(),
          name: translation.data.name,
          overview: translation.data.overview
        })
        .where({
          id: previousTranslation.id
        })
    } else {
      debug('adding translation for anime:', id, '/language:', translation.iso_639_1)

      translationsToInsert.push({
        updatedAt: Date.now(),
        animeId: id,
        language: translation.iso_639_1,
        name: translation.data.name,
        overview: translation.data.overview
      })
    }
  }

  // NOTE: bulk-insert for performance; added loop due to some conflicts when we use sqlite provider because of too fast performance;
  for (let n = 0, z = translationsToInsert.length; n < z; n += 5) {
    await knex('anime_details')
      .insert(translationsToInsert.slice(n, n + 5))
  }

  return id
}
