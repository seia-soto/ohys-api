module.exports = table => {
  table.increments()

  // NOTE: api specification;
  table.integer('episodeId')

  // NOTE: metadata;
  table.string('url', 2048)
  table.string('filename', 1024)
}
