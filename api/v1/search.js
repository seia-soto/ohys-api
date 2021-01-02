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
        'posterImage'
      )
      .where('name', 'like', term)
      .orWhere('scheduleName', 'like', term)
      .limit(limit)

    const animes = []

    for (let i = 0, l = results.length; i < l; i++) {
      const item = results[i]

      item.translations = await knex('anime_details')
        .select('language', 'name')
        .where({
          animeId: item.id,
          language: language.length === 2
            ? language
            : 'en'
        })

      animes.push(item)
    }

    return animes
  }
}

module.exports = (app, opts, done) => {
  app.route(searchAnimes)

  done()
}
