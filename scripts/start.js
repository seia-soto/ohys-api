const fs = require('fs')
const path = require('path')
const structures = require('../structures')
const config = require('../config')
const debug = require('./debug')

module.exports = (async () => {
  debug('starting the application')

  const requiredDirectories = [
    config.data.base,
    config.data.posters,
    config.data.torrents
  ]

  debug('checking if data directories are ready')

  for (let i = 0, l = requiredDirectories.length; i < l; i++) {
    const directory = path.join(__dirname, '..', requiredDirectories[i])

    debug('checking if directory exists:', directory)

    if (!fs.existsSync(directory)) {
      debug('creating:', directory)

      fs.mkdirSync(directory)
    }
  }

  await structures.database.createTables()

  // NOTE: code;
  const schedulers = {}

  schedulers.ohys = {}
  // NOTE: update schedule every hour;
  schedulers.ohys.schedule = await structures.utils.createCron('0 * * * *', structures.tasks.updateSchedule, {
    useFirstRun: 1,
    waitFirstRun: 1
  })
})()
