const fetch = require('node-fetch')
const qs = require('qs')
const config = require('../../config')
const { name, version } = require('../../package.json')
const debug = require('./debug')

const query = async (path, opts, retries) => {
  'use strict'

  if (retries >= 5) return false

  opts = opts || {}
  opts.api_key = opts.api_key || config.externals.tmdb.v3ApiKey

  const url = 'https://api.themoviedb.org/3' + path + '?' + qs.stringify(opts)

  debug('requesting to:', url.replace(opts.api_key, ''))

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`
      }
    })
    const data = await res.json()

    return data
  } catch (e) {
    return query(path, opts, retries + 1)
  }
}

module.exports = query
