module.exports = table => {
  table.increments()
  table.datetime('updatedAt')

  // NOTE: metadata;
  table.string('name', 1024)
  table.string('scheduleName', 1024)
  table.string('network', 512)
  table.string('status', 64)
  table.string('backdropImage', 2048)
  table.string('posterImage', 2048)
  table.integer('year')
  table.integer('quarter')
  table.integer('airingDay')
  table.string('airingTime')

  // NOTE: 3rd parties;
  table.integer('tmdbId')

  return table
}
