module.exports = table => {
  table.increments()

  // NOTE: api specification;
  table.string('language', 2)

  // NOTE: metadata;
  table.string('title', 1024)
  table.string('description', 8192)
  table.string('broadcaster', 512)
  table.datetime('airingTime')

  return table
}
