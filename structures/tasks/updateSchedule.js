const { knex } = require('../database')
const ohys = require('../ohys')
const tmdb = require('../tmdb')
const { createLogger } = require('../utils')
const config = require('../../config')

const debug = createLogger('tasks/updateSchedule')
let isTaskActive = 0

module.exports = async () => {
  if (isTaskActive) {
    debug('function is already running from another call stack')

    return
  }

  // NOTE: mark this task has been started;
  isTaskActive = 1

  // NOTE: intialize terms;
  const currentYear = new Date().getFullYear()
  const years = []

  for (let i = 0; i < (config.ohys.getScheduleInRecentYears || 4); i++) {
    years.push(currentYear - i)
  }

  debug('gathering titles of already added items')

  // NOTE: loop years;
  for (let i = 0, l = years.length; i < l; i++) {
    const year = years[i]

    // NOTE: loop quarters;
    for (let k = 1; k <= 4; k++) {
      debug('querying schedule:', `${year}@${k}`)

      // NOTE: query schedule data;
      const schedule = await ohys.getSchedulePattern({
        year,
        quarter: k
      })
        .catch(error => debug('error while querying schedule:', error))

      if (!schedule) continue

      // NOTE: loop scheduled items;
      for (let j = 0, s = schedule.length; j < s; j++) {
        // NOTE: scheduled item on Ohys-Raws;
        const item = schedule[j]

        // NOTE: search the title;
        const { results: search } = await tmdb.query('/search/tv', {
          query: item.name.promised,
          include_adult: false
        })

        if (!search.length) continue

        // NOTE: get detailed information;
        const [ex, details, { translations }] = await Promise.all([
          knex('anime')
            .select('id')
            .where({ scheduleName: item.name.promised }),
          tmdb.query('/tv/' + search[0].id),
          tmdb.query('/tv/' + search[0].id + '/translations')
        ])

        // NOTE: fill optional values;
        if (!details.networks || !details.networks.length) details.networks = [{ name: 'unavailable' }]

        // NOTE: pre-define anime id to update;
        let id

        // NOTE: process detailed information of anime;
        if (ex.length) {
          id = ex[0].id

          debug('updating anime metadata:', id)

          await knex('anime')
            .update({
              updatedAt: Date.now(),
              name: details.name,
              network: details.networks[0].name,
              status: details.status,
              backdropImage: details.backdrop_path,
              posterImage: details.poster_path,
              airingDay: item.day,
              airingTime: item.time
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
              scheduleName: item.name.promised,
              network: details.networks[0].name,
              status: details.status,
              backdropImage: details.backdrop_path,
              posterImage: details.poster_path,
              year,
              quarter: k,
              airingDay: item.day,
              airingTime: item.time
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
      }
    }
  }

  isTaskActive = 0
}
