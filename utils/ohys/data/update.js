const crypto = require('../../crypto')
const database = require('../../database')
const fetch = require('../fetch')
const insert = require('./insert')

const update = async freshly => {
  const updateQueue = []
  const existingSources = await database.knex('animes')
    .select('*')

  let latestFeed = await fetch.list()

  if (freshly) {
    latestFeed = {
      serialized: await fetch.allList()
    }
  }

  for (let k = latestFeed.serialized.length - 1; k >= 0; k--) {
    const item = latestFeed.serialized[k]
    const itemStringified = await JSON.stringify(item)
    const itemHash = await crypto.hash.md5(itemStringified)
    const existingItem = await existingSources.find(item => item.hash === itemHash)

    if (!existingItem) {
      await updateQueue.push(item)
    }
  }

  insert(updateQueue)
}

module.exports = update
