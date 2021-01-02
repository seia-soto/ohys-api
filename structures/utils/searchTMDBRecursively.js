const tmdb = require('../tmdb')

const recursiveSearch = async title => {
  'use strict'

  if (!title) return []

  const { results } = await tmdb.query('/search/tv', {
    query: title,
    include_adult: false
  })

  if (results && results.length) return results

  const fragments = title.split(' ')

  fragments.pop()

  return recursiveSearch(fragments.join(' '))
}

module.exports = recursiveSearch
