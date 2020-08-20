const fetch = require('node-fetch')
const fs = require('fs')
const path = require('path')
const parseTorrent = require('parse-torrent')

const assets = require('../assets')
const database = require('../database')
const ohys = require('../ohys')
const utils = require('../utils')
const config = require('../config')
const debug = require('./debug')

const queue = []
let isWorking = 0

module.exports = async () => {
  if (!config.ohys.sync.torrentMetadata) return

  debug('finding anime episode entries whose torrent metadata is unsynced yet')

  const animes = await database.knex('entries')
    .select('id', 'directDownloadLink')
    .whereNull('updatedAt')

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
          const directDownloadLink = ohys.completeDownloadLinkDynamically(parts[i].directDownloadLink)
          const dirpath = path.join(assets.getWorkspace(), 'torrents')
          const filepath = path.join(dirpath, decodeURIComponent(utils.getFilenameFromURL(directDownloadLink)))

          assets.createIfNotExists(dirpath)

          debug('downloading torrent from: ' + directDownloadLink)

          const res = await fetch(directDownloadLink)

          await new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(filepath)

            res.body.pipe(fileStream)
            fileStream.on('finish', () => resolve())
          })

          debug('parsing torrent info of downloaded torrent')

          const torrent = parseTorrent(fs.readFileSync(filepath))
          const magnetLink = parseTorrent.toMagnetURI(torrent)

          if (!torrent.length) continue

          await database.knex('entries')
            .update({
              torrentInfoHash: torrent.infoHash,
              torrentMagnetLink: magnetLink,
              isTorrentPrivate: torrent.private,
              torrentCreatedAt: torrent.created,
              torrentComment: torrent.comment,
              torrentAnnonces: torrent.announce.join(';'),
              updatedAt: new Date()
            })
            .where({
              id: parts[i].id
            })

          if (!config.ohys.sync.saveTorrentFiles) {
            debug('deleting parsed torrent file')

            fs.unlinkSync(filepath)
          }
        } catch (error) {
          debug('failed to parse current torrent due to following error and marking as parse failed: ' + error)

          await database.knex('entries')
            .update({
              updatedAt: new Date()
            })
            .where({
              id: parts[i].id
            })

          continue
        }
      }
    }
  } catch (error) {
    // NOTE: Close function safely.
    isWorking = 0

    throw error
  }

  isWorking = 0
}
