const ohys = require('../ohys')
const { createLogger, updateAnimeOf } = require('../utils')
const config = require('../../config')

const debug = createLogger('tasks/updateSchedule')
let isTaskActive = 0

module.exports = async () => {
  'use strict'

  if (isTaskActive) {
    debug('function is already running from another call stack')

    return
  }

  // NOTE: mark this task has been started;
  isTaskActive = 1

  debug('updating schedule')

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
      const schedule = await ohys.getSchedule({
        year,
        quarter: k
      })
        .catch(error => debug('error while querying schedule:', error))

      if (!schedule) continue

      // NOTE: loop scheduled items;
      for (let j = 0, s = schedule.length; j < s; j++) {
        // NOTE: scheduled item on Ohys-Raws;
        const item = schedule[j]

        await updateAnimeOf({
          name: item.name.promised,
          exQuery: {
            scheduleName: item.name.promised
          },
          extendData: {
            year,
            quarter: k,
            airingDay: item.day,
            airingTime: item.time
          }
        })
      }
    }
  }

  debug('updated schedules')

  isTaskActive = 0
}
