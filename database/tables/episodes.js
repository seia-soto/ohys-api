module.exports = table => {
  table
    .increments()
    .unique()

  table.string('animeName', 256)
  table.string('episodeNumber', 16)
  table.string('directDownloadLink', 2048)
  // NOTE: Video metadata
  table.string('originalFileName', 512)
  table.string('provider', 32)
  table.string('channel', 32)
  table.string('resolution', 16)
  table.string('audioFormat', 16)
  table.string('videoFormat', 16)
  // NOTE: Application metadata
  table.datetime('updatedAt')
}
