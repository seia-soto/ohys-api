module.exports = table => {
  table.increments()
  table.datetime('updatedAt')

  // NOTE: api specification;
  table.integer('animeId')
  table.string('language', 2)

  // NOTE: metadata;
  table.string('name', 1024)
  table.string('overview', 8192)

  return table
}
