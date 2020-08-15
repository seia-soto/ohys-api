const anilist = require('../anilist')
const database = require('../database')
const config = require('../config')
const debug = require('./debug')

const queue = []
let isWorking = 0

module.exports = async () => {
  if (!config.ohys.sync.animeMetadata) return

  debug('finding anime entries whose metadata is unsynced yet')

  const animes = await database.knex('animes')
    .select('id', 'name')
    .where('updatedAt', '<=', new Date(Date.now() - config.anilist.sync.interval))

  debug(`found unsynced ${animes.length} items from database and filtering duplicated items`)

  for (let i = 0, l = animes.length; i < l; i++) {
    if (!queue.find(item => item.name === animes[i].name)) {
      queue.push(animes[i])
    }
  }

  debug('enqueued all unsynced items')

  if (isWorking) return

  isWorking = 1

  try {
    while (queue.length) {
      const parts = queue.splice(0, queue.length)

      for (let i = 0, l = parts.length; i < l; i++) {
        const part = parts[i]

        debug('updating metadata for anime: ' + part.name)

        const data = await anilist.searchMetadataRecursively(part.name)
        const metadata = data.Page.media[0] || {}

        metadata.title = metadata.title || {}
        metadata.coverImage = metadata.coverImage || {}
        metadata.genres = metadata.genres || []

        await database.knex('animes')
          .update({
            japaneseName: metadata.title.native,
            englishName: metadata.title.english,
            description: metadata.description,
            releasedAt: metadata.seasonYear,
            season: metadata.season,
            genres: metadata.genres.join(';'),
            type: metadata.type,
            format: metadata.format,
            airingStatus: metadata.status,
            duration: metadata.duration,
            posterImageURL: metadata.coverImage.extraLarge,
            isAdult: metadata.isAdult,
            anilistId: metadata.id,
            myanimelistId: metadata.idMal,
            updatedAt: new Date()
          })
          .where({
            id: part.id
          })
      }
    }
  } catch (error) {
    // NOTE: Clost function safely.
    queue.splice(0, queue.length)
    isWorking = 0

    throw error
  }

  isWorking = 0
}
