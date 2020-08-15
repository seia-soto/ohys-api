const database = require('../database')
const ohys = require('../ohys')
const config = require('../config')
const debug = require('./debug')

module.exports = async animes => {
  const syncedEpisodes = await database.knex('entries')
    .select('directDownloadLink')
    .limit(animes.length)
  const unsyncedEpisodes = []
  const syncedEpisodeIdentificators = []

  for (let i = 0, l = syncedEpisodes.length; i < l; i++) {
    syncedEpisodeIdentificators.push(syncedEpisodes[i].directDownloadLink)
  }
  for (let i = 0, l = animes.length; i < l; i++) {
    const item = ohys.serializeData(animes[i])

    if (!syncedEpisodeIdentificators.includes(item.directDownloadLink)) {
      unsyncedEpisodes.push({
        animeName: item.series,
        episodeNumber: item.episode,
        directDownloadLink: item.directDownloadLink,
        originalFileName: item.original,
        provider: item.provider,
        channel: item.channel,
        resolution: item.resolution,
        audioFormat: item.audioFormat,
        videoFormat: item.videoFormat,
        createdAt: new Date()
      })
    }
  }

  debug(`inserting ${unsyncedEpisodes.length} unsynced episode data to the database`)

  for (let i = 0, l = unsyncedEpisodes.length; i < l; i += config.ohys.sync.batchQuerySize) {
    let iter = i + config.ohys.sync.batchQuerySize

    if (iter > l) {
      iter = l
    }

    debug(`inserting parted ${iter - i} items (${i}~${iter})`)

    await database.knex
      .insert(unsyncedEpisodes.slice(i, iter))
      .into('entries')
  }

  return unsyncedEpisodes
}
