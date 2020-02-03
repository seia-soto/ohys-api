const config = require('../../config')
const log = require('../../log')
const database = require('../database')
const data = require('./data')
const fetch = require('./fetch')

module.exports = async () => {
  const items = await fetch.allList()
  const itemsUpdated = await database.knex('animes').count('id')

  if (!itemsUpdated.length) {
    await data.insert(items)
  }
  if (itemsUpdated < items) {
    await data.insert(items.slice(0, items - itemsUpdated))
  }

  setInterval(async () => {
    log(`downloading new feed: ${Date.now()}`)

    let itemsCreated = await fetch.list()

    // NOTE: Remove duplicates.
    itemsCreated = await itemsCreated.filter((item, position) => {
      const currentItem = JSON.stringify(item)

      return position === itemsCreated.findIndex(_item => currentItem === JSON.stringify(_item))
    })

    await data.insert(itemsCreated)
  }, config.ohys.refreshRate)
}
