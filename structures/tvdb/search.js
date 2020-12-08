const fetch = require('node-fetch')
const qs = require('qs')

const { name, version } = require('../../package.json')
const debug = require('./debug')

module.exports = async (opts = {}) => {
  // NOTE: build query;
  opts.base = opts.base || 'https://tvshowtime-dsn.algolia.net/1/indexes/*/queries'
  opts.algolia = opts.algolia || {}
  opts.algolia.agent = opts.algoliaAgent || 'Algolia for vanilla JavaScript (lite) 3.32.0;instantsearch.js (3.5.3);JS Helper (2.28.0)'
  opts.algolia.id = opts.algoliaId || 'tvshowtime'
  opts.algolia.key = 'c9d5ec1316cec12f093754c69dd879d3' // NOTE: pre-calculated;
  opts.tvdb = opts.tvdb || {}
  opts.tvdb.query = opts.tvdb.query || ''
  opts.tvdb.maxValuesPerFacet = opts.maxValuesPerFacet || 10
  opts.tvdb.page = opts.tvdb.page || 0
  opts.tvdb.highlightPreTag = opts.highlightPreTag || '__ais-highlight__'
  opts.tvdb.highlightPostTag = opts.highlightPostTag || '__/ais-highlight__'
  opts.tvdb.facets = JSON.stringify(opts.tvdb.facets || ['type', 'type'])
  opts.tvdb.tagFilters = opts.tvdb.tagFilters || ''

  const url = opts.base + '?' + qs.stringify({
    'x-algolia-agent': opts.algolia.agent,
    'x-algolia-application-id': opts.algolia.id,
    'x-algolia-api-key': opts.algolia.key
  })

  debug('sending request to', url)

  // NOTE: request;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`,
      accept: 'application/json',
      'Cache-Control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded',
      DNT: 1,
      Host: 'tvshowtime-dsn.algolia.net',
      Origin: 'https://thetvdb.com',
      Pragma: 'no-cache',
      Referer: 'https://thetvdb.com/'
    },
    body: JSON.stringify({
      requests: [
        {
          indexName: 'TVDB',
          params: qs.stringify(opts.tvdb)
        }
      ]
    })
  })

  debug('got response')

  const json = await res.json()

  return json
}
