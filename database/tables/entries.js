module.exports = table => {
  table
    .increments()
    .unique()

  table.string('animeName', 256)
  table.string('episodeNumber', 16)
  table.string('directDownloadLink', 2048)
    .unique()
  // NOTE: Video metadata
  table.string('originalFileName', 512)
  table.string('provider', 32)
  table.string('channel', 32)
  table.string('resolution', 16)
  table.string('audioFormat', 16)
  table.string('videoFormat', 16)
  // NOTE: Torrent metadata
  table.string('torrentInfoHash', 128)
  table.string('torrentMagnetLink', 8192)
  table.boolean('isTorrentPrivate')
  table.datetime('torrentCreatedAt')
  table.string('torrentComment', 4096)
  table.string('torrentAnnonces', 4096)
  // NOTE: Application metadata
  table.datetime('createdAt')
  table.datetime('updatedAt')
}
