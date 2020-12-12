const fetch = require('node-fetch')
const qs = require('qs')
const config = require('../../config')
const { name, version } = require('../../package.json')

module.exports = (path, opt = {}) => {
  opt.api_key = config.externals.tmdb.v3ApiKey

  const url = 'https://api.themoviedb.org/3' + path + '?' + qs.stringify(opt)

  return fetch(url, {
    headers: {
      'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`
    }
  })
}
