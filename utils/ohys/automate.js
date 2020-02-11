const config = require('../../config')
const log = require('../../log')
const database = require('./database')

module.exports = async () => {
  await database.update(true)

  setInterval(async () => {
    log('updating database at ' + Date.now())

    await database.update()
  }, config.ohys.refreshRate)
}
