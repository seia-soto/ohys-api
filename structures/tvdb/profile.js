const cheerio = require('cheerio')
const fetch = require('node-fetch')

const { name, version } = require('../../package.json')
const debug = require('./debug')

module.exports = async (path = '') => {
  if (!path) return

  // NOTE: build query
  const url = 'https://thetvdb.com/' + path

  debug('sending request to:', url)

  // NOTE: request;
  const res = await fetch(url, {
    headers: {
      'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`,
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      dnt: 1
    }
  })

  debug('got response')

  const text = await res.text()

  const query = cheerio.load(text, {
    normalizeWhitespace: true,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true
  })
  const result = {}

  query('.list-group-item.clearfix')
    .toArray()
    .map(element => {
      const key = query(element).find('strong').text().toLowerCase()
      const values = query(element).find('span').toArray()
        .map(value => query(value).text().trim())

      result[key] = values
    })

  return result
}
