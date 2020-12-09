module.exports = table => {
  table.increments()

  // NOTE: metadata;
  table.string('title', 1024)
  table.string('broadcaster', 512)
  table.string('status', 64)
  table.date('releaseDate')

  return table
}
