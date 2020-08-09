const fetch = require('node-fetch')

const config = require('../config')
const debug = require('./debug')

module.exports = async (query, variables) => {
  debug('querying anilist GQL api')

  const response = await fetch(config.anilist.api, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    })
  })
  const data = await response.json()

  return data
}
