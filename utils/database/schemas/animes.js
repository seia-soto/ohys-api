module.exports = async lib => {
  await lib.schema.createTable('animes', table => {
    table.increments().primary()

    table.string('hash', 32).notNullable()

    table.string('episode', 8).notNullable()
    table.string('series', 256).notNullable()
    table.string('link', 1024).notNullable()
    table.string('resolution', 32).notNullable()
    table.string('audioFormat', 32).notNullable()
    table.string('videoFormat', 32).notNullable()
    table.string('broadcaster', 32).notNullable()
    table.string('original', 256).notNullable()

    table.timestamp('created_at').defaultTo(lib.fn.now())
    table.timestamp('updated_at').defaultTo(lib.fn.now())
  })
}
