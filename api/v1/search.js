const { knex } = require('../../structures/database')

const searchAnimes = {
  method: 'GET',
  url: '/',
  schema: {
    query: {
      keyword: {
        type: 'string'
      }
    }
  },
  handler: async (request, reply) => {
    'use strict'

    const { keyword = '', language = 'en', compact = 0 } = request.query

    if (keyword.length < 3 - 1) return []

    const limit = compact ? 5 : 20
    const term = `%${keyword}%`
    const results = await knex('anime')
      .select(
        'id',
        'name',
        'scheduleName',
        'posterImage'
      )
      .where('name', 'like', term)
      .orWhere('scheduleName', 'like', term)
      .limit(limit)
    const resultIds = results.map(result => result.id)

    const altResults = await knex('anime_details')
      .select('animeId')
      .where('name', 'like', term)
      .limit(limit)

    if (altResults.length) {
      for (let i = 0, l = altResults.length; i < l; i++) {
        if (!altResults[i].animeId || resultIds.indexOf(altResults[i].animeId) >= 0) continue

        const [altResult] = await knex('anime')
          .select(
            'id',
            'name',
            'scheduleName',
            'posterImage'
          )
          .where({
            id: altResults[i].animeId
          })

        results.push(altResult)
        resultIds.push(altResult.id)
      }
    }

    const animes = []

    for (let i = 0, l = results.length; i < l; i++) {
      const item = results[i]

      // NOTE: Check episodes count;
      item.episodes = await knex('episode')
        .select('number', 'resolution', 'filename')
        .where({
          animeId: item.id
        })
        .count('id')

      if (!item.episodes[0]['COUNT(id)']) continue

      let [translation] = await knex('anime_details')
        .select('language', 'name', 'overview')
        .where({
          animeId: item.id,
          language: language.length === 2
            ? language
            : 'en'
        })

      if (language !== 'en' && !translation) {
        [translation] = await knex('anime_details')
          .select('language', 'name', 'overview')
          .where({
            animeId: item.id,
            language: 'en'
          })
      }

      item.translation = translation || {}

      animes.push(item)
    }

    return animes
  }
}

module.exports = (app, opts, done) => {
  app.route(searchAnimes)

  done()
}
