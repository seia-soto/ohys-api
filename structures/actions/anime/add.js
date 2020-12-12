const path = require('path')
const config = require('../../../config')
const { knex } = require('../../database')
const { download } = require('../file')
const debug = require('./debug')

const dayFilter = [
  'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
]

module.exports = async (data = {}) => {
  debug('checking if anime already added:', data.name)

  let [id] = await knex('anime')
    .select('id')
    .where({
      title: data.name
    })

  if (id) return id

  const { profile = {} } = data

  // NOTE: build query;
  const query = {}

  query.title = data.name
  query.broadcaster = data.network
  query.status = (data.status || '').toLowerCase()
  query.release = data.first_aired

  if (profile.airs && profile.airs[0]) {
    debug('parsing airing time:', profile.airs[0])

    const divided = profile.airs[0].split(',')

    for (let i = 0, l = divided.length; i < l - 1; i++) {
      // NOTE: bitwise operation; `base & (1 << n)` to calc;
      query.airingDay = (query.airingDay || 0) | 1 << dayFilter.indexOf(divided[0].slice(0, 3).toLowerCase())
    }

    const last = divided[divided.length - 1]

    if (last) {
      const [, hours, minutes, meridiemTerm = ''] = last.match(/(\d{1,2}):(\d{1,2})(\w{2})?/)

      if (hours && minutes) query.airingTime = `${meridiemTerm.toLowerCase() === 'pm' ? Number(hours) + 12 : hours}:${minutes}`
    }
  }

  // NOTE: prevent ESlint error by not using literal;
  [id] = await knex('anime')
    .returning('id') // NOTE: return `animeId` for future relations;
    .insert(query)
    .catch(error => debug('error while inserting metadata into database:', error))

  debug('updating details:', data.name)

  const titleLanguages = Object.keys(data.translations || {})
  const detailed = []

  // NOTE: loop translations;
  for (let n = 0, z = titleLanguages.length; n < z; n++) {
    const language = titleLanguages[n]

    detailed.push({
      animeId: id,
      language: language.slice(0, 2), // NOTE: normalize language code into two chars;
      title: data.translations[language],
      description: data.overviews[language]
    })
  }

  // NOTE: write translations;
  await knex('anime_details')
    .insert(detailed)
    .catch(error => debug('error while inserting detailed metadata into database:', error))

  // NOTE: downloading poster;
  debug('downloading poster')

  if (data.poster) {
    await download(data.poster, path.join(__dirname, '..', '..', '..', config.data.posters, String(id)), true)
  }

  return id
}
