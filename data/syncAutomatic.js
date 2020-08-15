const ohys = require('../ohys')
const config = require('../config')
const debug = require('./debug')
const syncAll = require('./syncAll')
const syncMetadata = require('./syncMetadata')

const sync = async interval => {
  interval = interval || 0

  const startTime = Date.now()

  try {
    const animes = await ohys.getList({
      page: 0
    })

    await syncAll(animes)

    if (config.ohys.sync.animeMetadata && (!interval || !(interval % (config.anilist.sync.interval / config.ohys.sync.interval)))) {
      syncMetadata()

      interval = 0
    }
  } catch (error) {
    debug('met unexpected error while running sync scripts: ' + error)
  }

  const endTime = Date.now()
  let nextTime = config.ohys.sync.interval - (endTime - startTime)

  if ((startTime + config.ohys.sync.interval) < endTime) {
    nextTime = 0
  }

  setTimeout(() => sync(++interval), nextTime)
}

module.exports = sync
