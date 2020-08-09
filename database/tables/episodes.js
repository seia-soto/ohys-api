module.exports = table => {
  table
    .increments()
    .unique()

  table.string('animeName', 256)
  table.string('episodeName', 256)
  table.integer('episodeNumber', 11)
  table.string('directDownloadLink', 2048)
  // NOTE: Application metadata
  table.datetime('updatedAt')
}
