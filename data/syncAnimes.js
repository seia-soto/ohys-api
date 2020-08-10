const database = require('../database')
const ohys = require('../ohys')
const config = require('../config')
const debug = require('./debug')

module.exports = async animes => {
  const syncedAnimes = await database.knex('animes')
    .select('name')
    .limit(animes.length)
  const unsyncedAnimes = []
  const syncedAnimeTitles = []

  for (let i = 0, l = syncedAnimes.length; i < l; i++) {
    syncedAnimeTitles.push(syncedAnimes[i].name)
  }
  for (let i = 0, l = animes.length; i < l; i++) {
    const item = ohys.serializeData(animes[i])

    if (!syncedAnimeTitles.includes(item.series)) {
      unsyncedAnimes.push({
        name: item.series,
        updatedAt: new Date()
      })
    }
  }

  debug(`inserting ${unsyncedAnimes.length} unsynced anime metadata to the database`)

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
