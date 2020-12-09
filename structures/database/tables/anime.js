module.exports = table => {
  table.increments()

  // NOTE: metadata;
  table.string('title', 1024)
  table.string('broadcaster', 512)
  table.string('status', 64)
  table.date('release')
  table.string('genres', 2048) // NOTE: encoder=base64; divider=semicolon;
  table.integer('airingDay')
  table.time('airingTime')

  return table
}
