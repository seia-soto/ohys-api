const fetch = require('node-fetch')
const qs = require('qs')
const config = require('../../config')
const { name, version } = require('../../package.json')
const debug = require('./debug')

module.exports = async (path, opts) => {
  'use strict'

  opts = opts || {}
  opts.api_key = opts.api_key || config.externals.tmdb.v3ApiKey

  const url = 'https://api.themoviedb.org/3' + path + '?' + qs.stringify(opts)

  debug('requesting to:', url.replace(opts.api_key, ''))

  const res = await fetch(url, {
    headers: {
      'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`
    }
  })
  const data = await res.json()

  return data
}
