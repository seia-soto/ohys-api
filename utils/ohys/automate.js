const config = require('../../config')
const log = require('../../log')
const database = require('../database')
const data = require('./data')
const fetch = require('./fetch')

module.exports = async () => {
  const latestFeed = await fetch.allList()
  const existingFeed = await database.knex('animes').select('*')

  if (latestFeed.length > existingFeed.length) {
    await data.insert(latestFeed.slice(0, latestFeed.length - existingFeed.length))
  }

  setInterval(async () => {
    log(`updating database: ${Date.now()}`)

    const latestFeedUpdate = await fetch.list()
    const existingFeedUpdate = await database.knex('animes').select('*')

    const newItems = await latestFeedUpdate.serialized.filter(item => {
      return !existingFeedUpdate.find(eItem => eItem.original === item.name)
    })

    await data.insert(newItems)
  }, config.ohys.refreshRate)
}
