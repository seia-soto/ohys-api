const tvdb = require('../../tvdb')
const debug = require('./debug')

module.exports = async (title, useDefaultValues) => {
  debug('querying metadata of:', title)

  const searchResult = await tvdb.search({
    tvdb: {
      query: title
    }
  })
    .catch(error => debug('error while querying metadata:', error))

  if (!(searchResult && searchResult.results && searchResult.results[0].hits.length)) {
    debug('metadata not found, skipping')

    return
  }

  const metadata = searchResult.results[0].hits[0]

  // NOTE: get profiles;
  const profile = await tvdb.profile(metadata.url)
    .catch(error => debug('error while profiling tvdb url:', error))

  if (!profile) {
    debug('profiling failed, skipping')

    return metadata
  }

  return {
    ...metadata,
    profile
  }
}
