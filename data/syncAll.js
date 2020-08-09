const database = require('../database')
const ohys = require('../ohys')
const config = require('../config')
const debug = require('./debug')

module.exports = async () => {
  debug('forcing application to sync all content')

  const latestList = await ohys.getAllList()
  const syncedAnimes = await database.knex('animes')
    .select('*')
  const syncedEpisodes = await database.knex('episodes')
    .select('*')
  const syncedAnimeTitles = []
  const syncedEpisodeIdentificators = []
  const unsyncedAnimes = []
  const unsyncedEpisodes = []

  for (let i = 0, l = syncedAnimes.length; i < l; i++) {
    syncedAnimeTitles.push(syncedAnimes[i].originalFileName)
  }
  for (let i = 0, l = syncedEpisodes.length; i < l; i++) {
    syncedEpisodes.push(syncedEpisodes[i].animeName + syncedEpisodes[i].episodeNumber)
  }
  for (let i = 0, l = latestList.length; i < l; i++) {
    const payload = ohys.serializeData(latestList[i])

    if (!syncedAnimeTitles.includes(payload.series)) {
      unsyncedAnimes.push({
        name: payload.series,
        updatedAt: new Date()
      })
    }
    if (!syncedEpisodeIdentificators.includes(payload.series + payload.episode)) {
      unsyncedEpisodes.push({
        animeName: payload.series,
        episodeNumber: payload.episode,
        directDownloadLink: payload.directDownloadLink,
        originalFileName: payload.original,
        provider: payload.provider,
        channel: payload.channel,
        resolution: payload.resolution,
        audioFormat: payload.audioFormat,
        videoFormat: payload.videoFormat,
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

  debug(`inserting ${unsyncedEpisodes} unsynced episode data to the database`)

  for (let i = 0, l = unsyncedEpisodes.length; i < l; i += config.ohys.sync.batchQuerySize) {
    let iter = i + config.ohys.sync.batchQuerySize

    if (iter > l) {
      iter = l
    }

    debug(`inserting parted ${iter - i} items (${i}~${iter})`)

    await database.knex
      .insert(unsyncedEpisodes.slice(i, iter))
      .into('episodes')
  }
}
