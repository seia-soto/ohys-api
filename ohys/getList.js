const fetch = require('node-fetch')

const buildFormBody = require('../utils/buildFormBody')
const getEndpoint = require('./getEndpoint')

module.exports = async opts => {
  opts.page = opts.page || '0'
  opts.query = opts.query || ''
  opts.dir = opts.dir || 'disk'

  const params = buildFormBody({
    dir: opts.dir,
    p: opts.page,
    q: opts.query
  })
  const response = await fetch(getEndpoint('api') + '?' + params)
  const rawText = await response.text()
  // NOTE: Remove unwanted whitespaces
  const text = rawText.replace(/^\s+|\s+$|\s+(?=\s)/g, '')
  const data = JSON.parse(text)

  return data
}
