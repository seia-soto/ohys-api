module.exports = table => {
  table
    .increments()
    .unique()

  table.string('name', 256)
  table.string('japaneseName', 256)
  table.string('romajiName', 256)
  table.datetime('releasedAt')
  table.string('season', 16)
  table.string('genres', 2048)
  table.string('type')
  table.string('format')
  table.string('airingStatus')
  table.integer('episodes')
  table.integer('duration')
  table.string('orinalSource', 32)
  table.string('posterImageURL', 2048)
  table.boolean('isAdult')
  // NOTE: External metadata
  table.integer('anilistId', 11)
  table.integer('myanimelistId', 11)
  // NOTE: Application metadata
  table.datetime('updatedAt')
}
