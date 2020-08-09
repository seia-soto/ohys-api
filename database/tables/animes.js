module.exports = table => {
  table
    .increments()
    .unique()

  table.string('name', 256)
  table.string('japaneseName', 256)
  table.datetime('releasedAt')
  table.string('season', 16)
  table.string('genres', 2048)
  table.string('type', 16)
  table.string('format', 16)
  table.string('airingStatus', 16)
  table.integer('duration', 11)
  table.string('orinalSource', 32)
  table.string('posterImageURL', 2048)
  table.boolean('isAdult')
  // NOTE: Video metadata
  table.string('originalFileName', 512)
  table.string('provider', 32)
  table.string('channel', 32)
  table.string('resolution', 16)
  table.string('audioFormat', 16)
  table.string('videoFormat', 16)
  // NOTE: External metadata
  table.integer('anilistId', 11)
  table.integer('myanimelistId', 11)
  // NOTE: Application metadata
  table.datetime('updatedAt')
  table.boolean('isUpdating')
}
