const schemas = require('./tables')
const debug = require('./debug')
const knex = require('./knex')

module.exports = async () => {
  const tables = Object.keys(schemas)

  debug('checking if tables are existing')

  for (let i = 0, l = tables.length; i < l; i++) {
    const table = tables[i]
    const schema = schemas[table]

    debug('checking available of table:', table)

    if (!await knex.schema.hasTable(table)) {
      debug('creating table:', table)

      await knex.schema.createTable(table, schema)
    }
  }
}
