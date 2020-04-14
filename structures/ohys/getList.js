const fetch = require('node-fetch')

const log = require('./log')

module.exports = async opts => {
  opts = opts || {}

  opts.query = opts.query || ''
  opts.page = String(opts.page || '0')

  try {
    const serialized = []
    const response = await fetch(`https://torrents.ohys.net/t/json.php?dir=disk&q=${opts.query}&p=${opts.page}`)
    const buffer = await response.text()
    const data = JSON.parse(buffer.slice(1))

    log(`loading ${data.length} items from page ${opts.page}`)

    for (let i = 0; i < data.length; i++) {
      serialized.push({
        name: data[i].t,
        url: 'https://torrents.ohys.net/t/' + data[i].a
      })
    }

    return {
      data: serialized
    }
  } catch (error) {
    log(`retrying to load items from page ${opts.page}`)
    log(error)

    if (opts.retry) {
      return this(opts)
    } else {
      return {
        error
      }
    }
  }
}
