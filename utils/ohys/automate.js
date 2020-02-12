const config = require('../../config')
const log = require('../../log')
const data = require('./data')

module.exports = async () => {
  await data.update(true)

  setInterval(async () => {
    log('updating database at ' + Date.now())

    await data.update()
  }, config.ohys.refreshRate)
}
