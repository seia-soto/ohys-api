module.exports = table => {
  // NOTE: api specification;
  table.integer('animeId')

  // NOTE: metadata;
  table.integer('year')
  table.integer('quarter')
  table.integer('day') // NOTE: starting from 0; also duplicate the value of `anime` for fast search;
  table.string('comment', 2048)

  return table
}
