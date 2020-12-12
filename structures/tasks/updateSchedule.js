const actions = require('../actions')
const { knex } = require('../database')
const ohys = require('../ohys')
const { createLogger } = require('../utils')

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
      const schedule = await ohys.getSchedulePattern({
        year,
        quarter: k
      })
        .catch(error => debug('error while querying schedule:', error))

      if (!schedule) continue

      // NOTE: loop scheduled items;
      for (let j = 0, s = schedule.length; j < s; j++) {
        const metadata = await actions.anime.query(schedule[j].name.English || schedule[j].name.promised)

        if (!metadata) continue

        // NOTE: grab `animeId`;
        let id = existing.items[metadata.name]

        // NOTE: insert new anime object when not found;
        if (!id) {
          id = await actions.anime.add(metadata)
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
      }
    }
  }

  isTaskActive = 0
}
