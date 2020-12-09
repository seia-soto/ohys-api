module.exports = table => {
  table.increments()

  // NOTE: api specification;
  table.integer('animeId')
  table.string('language', 2)

  // NOTE: metadata;
  table.string('title', 1024)
  table.string('description', 8192)

  return table
}
