module.exports = table => {
  table.integer('year')
  table.integer('quarter')
  table.integer('day') // NOTE: starting from 0;
  table.string('name', 1024)
  table.string('comment', 2048)
  table.time('airing')

  return table
}
