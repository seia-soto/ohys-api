module.exports = async lib => {
  await lib.schema.createTable('series', table => {
    table.increments().primary()

    table.string('hash', 32).notNullable()

    table.string('name', 256).notNullable()
    table.string('titleNative', 128).notNullable()
    table.string('status', 16).notNullable()
    table.string('description', 8196).notNullable()
    table.string('coverImageURL', 512).notNullable()

    table.timestamp('created_at').defaultTo(lib.fn.now())
    table.timestamp('updated_at').defaultTo(lib.fn.now())
  })
}
