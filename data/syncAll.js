const database = require('../database')
const ohys = require('../ohys')
const config = require('../config')
const debug = require('./debug')

module.exports = async () => {
  debug('forcing application to sync all content')

  const latestList = await ohys.getAllList()
  const syncedAnimes = await database.knex('animes')
    .select('*')
  const syncedAnimeTitles = []
  const unsyncedAnimes = []

  for (let i = 0, l = syncedAnimes.length; i < l; i++) {
    syncedAnimeTitles.push(syncedAnimes[i].originalFileName)
  }
  for (let i = 0, l = latestList.length; i < l; i++) {
    if (!syncedAnimeTitles.includes(latestList[i].t)) {
      const payload = ohys.serializeData(latestList[i])

      unsyncedAnimes.push(payload)
    }
  }

  debug(`inserting ${unsyncedAnimes.length} items to database`)

  for (let i = 0, l = unsyncedAnimes.length; i < l; i += config.ohys.sync.batchQuerySize) {
    let iter = i + config.ohys.sync.batchQuerySize

    if (iter > l) {
      iter = l
    }

    debug(`inserting parted ${iter - i} items (${i}~${iter})`)

    await database.knex
      .insert(unsyncedAnimes.slice(i, iter))
      .into('animes')
  }
}
