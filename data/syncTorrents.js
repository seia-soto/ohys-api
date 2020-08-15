const fetch = require('node-fetch')
const parseTorrent = require('parse-torrent')

const database = require('../database')
const config = require('../config')
const debug = require('./debug')

const queue = []
let isWorking = 0

module.exports = async () => {
  if (!config.ohys.sync.torrentMetadata) return

  debug('finding anime episode entries whose torrent metadata is unsynced yet')

  const animes = await database.knex('entries')
    .select('id', 'directDownloadLink')
    .whereNull('torrentInfoHash')

  debug(`found unsynced ${animes.length} items from database and filtering duplicated items`)

  for (let i = 0, l = animes.length; i < l; i++) {
    if (!queue.find(item => item.id === animes[i].id)) {
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
        try {
          debug('downloading torrent from: ' + parts[i].directDownloadLink)

          const buffer = []
          const res = await fetch(parts[i].directDownloadLink)

          await new Promise((resolve, reject) => {
            res.body
              .on('data', data => buffer.push(data))
              .on('close', () => resolve())
          })

          debug('parsing torrent info of downloaded torrent')

          const torrent = parseTorrent(Buffer.from(buffer))
          const magnetLink = parseTorrent.toMagnetURI(torrent)

          if (!torrent.length) continue

          await database.knex('entries')
            .update({
              torrentInfoHash: torrent.infoHash,
              torrentMagnetLink: magnetLink,
              isTorrentPrivate: torrent.private,
              torrentCreatedAt: torrent.created,
              torrentComment: torrent.comment,
              torrentAnnonces: torrent.annonce.join(';')
            })
            .where({
              id: parts[i].id
            })
        } catch (error) {
          debug('failed to parse current torrent due to following error: ' + error)

          continue
        }
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
