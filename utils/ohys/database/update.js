const crypto = require('../../crypto')
const database = require('../../database')
const data = require('../data')
const fetch = require('../fetch')
// const scopes = require('../scopes')

const update = async freshly => {
  const existingSources = await database.knex('animes')
    .select('*')

  let latestFeed = await fetch.list()

  if (freshly) {
    latestFeed = {
      serialized: await fetch.allList()
    }
  }

  for (let k = 0; k < latestFeed.serialized.length; k++) {
    const item = latestFeed.serialized[k]
    const itemStringified = await JSON.stringify(item)
    const itemHash = await crypto.hash.md5(itemStringified)

    const existingItem = await existingSources.find(item => item.hash === itemHash)

    if (!existingItem) {
      await data.insert([item])
    }
  }
}

module.exports = update
