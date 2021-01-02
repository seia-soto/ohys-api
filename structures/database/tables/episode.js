module.exports = table => {
  table.increments()
  table.datetime('updatedAt')

  // NOTE: api specification;
  table.integer('animeId')

  // NOTE: metadata;
  table.float('number')
  table.string('resolution', 32)
  table.string('filename', 2048)

  return table
}
