const ohys = require('../ohys')
const config = require('../config')
const debug = require('./debug')
const syncAll = require('./syncAll')

const sync = async () => {
  const startTime = Date.now()

  try {
    const animes = await ohys.getList({
      page: 0
    })

    await syncAll(animes)
  } catch (error) {
    debug('met unexpected error while running sync scripts: ' + error)
  }

  const endTime = Date.now()
  let nextTime = config.ohys.sync.interval - (endTime - startTime)

  if ((startTime + config.ohys.sync.interval) < endTime) {
    nextTime = 0
  }

  setTimeout(() => sync(), nextTime)
}

module.exports = sync
