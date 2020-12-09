const { knex } = require('../../database')
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
    const airingTime = profile.airs[0].split('at ')[1].split(':')

    if (airingTime[1].slice(2) === 'pm') {
      airingTime[0] = Number(airingTime[0]) + 12
    }

    airingTime[1] = airingTime[1].slice(0, 2)

    query.airingDay = dayFilter.indexOf(profile.airs[0].slice(0, 3).toLowerCase())
    query.airingTime = `${airingTime[0]}:${airingTime[1]}`
  }

  // NOTE: prevent ESlint error by not using literal;
  [id] = await knex('anime')
    .returning('id') // NOTE: return `animeId` for future relations;
    .insert(query)
    .catch(error => debug('error while inserting metadata into database:', error))

  debug('updating details:', data.title)

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

  return id
}
