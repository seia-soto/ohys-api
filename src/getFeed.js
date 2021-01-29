const fetch = require('node-fetch')
const qs = require('qs')

const { name, version } = require('../../package.json')
const debug = require('./debug')

module.exports = async opts => {
  'use strict'

  opts = opts || {}
  opts.base = opts.base || 'http://eu.ohys.net/t'
  opts.endpoint = opts.endpoint || '/json.php'

  // NOTE: build querystring;
  const query = {
    dir: 'disk'
  }

  if (opts.page && !isNaN(opts.page)) query.p = opts.page
  if (opts.search) query.q = opts.search

  const url = opts.base + opts.endpoint + '?' + qs.stringify(query)

  debug('sending request to', url)

  // NOTE: request;
  const res = await fetch(url, {
    headers: {
      'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`
    }
  })

  debug('got response')

  const text = await res.text()

  debug('removing whitespaces from response')

  const json = JSON.parse(text.replace(/^\s+|\s+$|\s+(?=\s)/g, ''))

  // NOTE: post processing;
  if (opts.prettify) {
    debug('prettifying response')

    const prettified = []

    for (let i = 0, l = json.length; i < l; i++) {
      const item = json[i]

      prettified.push({
        name: item.t,
        link: opts.base + '/' + item.a
      })
    }

    return prettified
  }

  return json
}
