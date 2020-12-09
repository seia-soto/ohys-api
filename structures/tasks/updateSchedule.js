const { knex } = require('../database')
const ohys = require('../ohys')
const tvdb = require('../tvdb')
const { createLogger } = require('../utils')

const debug = createLogger('tasks/updateSchedule')
let isTaskActive = 0

const dayFilter = [
  'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'
]

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

  for (let i = 0; i < 4; i++) {
    years.push(currentYear - i)
  }

  debug('gathering titles of already added items')

  // NOTE: get already added items;
  const existing = {
    items: {},
    schedules: []
  }

  // NOTE: don't suppress the error in following queries;
  const animeRows = await knex('anime')
    .select('title', 'id')
    // .catch(error => debug('failed to load the list of existing anime metadata:', error))
  const scheduleRows = await knex('schedule')
    .select('animeId')

  animeRows.map(item => {
    existing.items[item.title] = item.id
  })
  scheduleRows.map(item => existing.schedules.push(item.animeId))

  // NOTE: loop years;
  for (let i = 0, l = years.length; i < l; i++) {
    const year = years[i]

    // NOTE: loop quarters;
    for (let k = 1; k <= 4; k++) {
      debug('querying schedule:', `${year}@${k}`)

      // NOTE: query schedule data;
      const schedule = await ohys.getScheduleCompatible({
        year,
        quarter: k
      })
        .catch(error => debug('error while querying schedule:', error))

      if (!schedule) continue

      // NOTE: loop scheduled items;
      for (let j = 0, s = schedule.length; j < s; j++) {
        debug('querying metadata of:', schedule[j].name)

        const searchResult = await tvdb.search({
          tvdb: {
            query: schedule[j].name
          }
        })
          .catch(error => debug('error while querying metadata:', error))

        if (!(searchResult && searchResult.results && searchResult.results[0].hits.length)) {
          debug('metadata not found, skipping')

          continue
        }

        const metadata = searchResult.results[0].hits[0]

        // NOTE: get profiles;
        const profile = await tvdb.profile(metadata.url)
          .catch(error => debug('error while profiling tvdb url:', error))

        if (!profile) {
          debug('profiling failed, skipping')

          continue
        }

        // NOTE: grab `animeId`;
        let id = existing.items[metadata.name]

        // NOTE: insert new anime object when not found;
        if (!id) {
          const airingTime = profile.airs[0].split('at ')[1].split(':')

          if (airingTime[1].slice(2) === 'pm') {
            airingTime[0] = Number(airingTime[0]) + 12
          }

          airingTime[1] = airingTime[1].slice(0, 2)

          // NOTE: prevent ESlint error by not using literal;
          id = await knex('anime')
            .returning('id') // NOTE: return `animeId` for future relations;
            .insert({
              title: metadata.name,
              broadcaster: metadata.network,
              status: metadata.status.toLowerCase(),
              release: metadata.first_aired || '1995-12-4',
              genres: profile.genres.map(genres => Buffer.from(genres).toString('base64')).join(';'),
              airingDay: dayFilter.indexOf(profile.airs[0].slice(0, 3).toLowerCase()),
              airingTime: `${airingTime[0]}:${airingTime[1]}`
            })
            .catch(error => debug('error while inserting metadata into database:', error))

          // NOTE: get first row from results;
          id = id[0]

          debug('updating details:', metadata.title)

          const titleLanguages = Object.keys(metadata.translations || {})
          const detailed = []

          // NOTE: loop translations;
          for (let n = 0, z = titleLanguages.length; n < z; n++) {
            const language = titleLanguages[n]

            detailed.push({
              animeId: id,
              language: language.slice(0, 2), // NOTE: normalize language code into two chars;
              title: metadata.translations[language],
              description: metadata.overviews[language] || ''
            })
          }

          await knex('anime_details')
            .insert(detailed)
            .catch(error => debug('error while inserting detailed metadata into database:', error))
        }
        // NOTE: insert new schedule object when not found;
        if (existing.schedules.indexOf(id) < 0) {
          await knex('schedule')
            .insert({
              animeId: id,
              year,
              quarter: k,
              day: schedule[j].day,
              comment: schedule[j].comment
            })
            .catch(error => debug('error while inserting schedule information:', error))
        }

        // NOTE: first batch end;
        process.exit(0)
      }
    }
  }

  isTaskActive = 0
}
