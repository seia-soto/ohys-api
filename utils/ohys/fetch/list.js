const request = require('request-promise')

const log = require('../../../log')

module.exports = async opts => {
  opts = opts || {}

  opts.query = opts.query = ''
  opts.page = String(opts.page || 1)

  delete opts.year

  try {
    const serialized = []
    // NOTE: Unexpected token '﻿'(whitespace character) in JSON at position 0 (serverside fault)
    const buffer = await request(`https://torrents.ohys.net/t/json.php?dir=disk&q=${opts.query}&p=${opts.page}`)
    const data = await JSON.parse(buffer.slice(1))

    log(`downloaded ${(opts.page * 30) + data.length} torrent info...`)

    for (let i = 0; i < data.length; i++) {
      await serialized.push({
        name: data[i].t,
        url: 'https://torrents.ohys.net/t/' + data[i].a
      })
    }

    return {
      serialized
    }
  } catch (error) {
    return {
      error
    }
  }
}
