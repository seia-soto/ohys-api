const tables = require('./tables')
const debug = require('./debug')
const knex = require('./knex')

module.exports = async () => {
  const tableNames = Object.keys(tables)

  for (let i = 0, l = tableNames.length; i < l; i++) {
    const tableName = tableNames[i]

    debug('checking the existance of table: ' + tableName)

    if (!await knex.schema.hasTable(tableName)) {
      debug('creating the table which does not exists: ' + tableName)

      await knex.schema.createTable(tableName, tables[tableName])
    }
  }
}
