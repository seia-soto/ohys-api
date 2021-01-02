const { knex } = require('../../structures/database')

const getAnime = {
  method: 'GET',
  url: '/',
  schema: {
    query: {
      id: {
        type: 'integer'
      }
    }
  },
  handler: async (request, reply) => {
    'use strict'

    const { id, language = 'en' } = request.query

    if (!id) return {}

    const [data] = await knex('anime')
      .select('*')
      .where({
        id
      })

    if (!data) return {}

    data.translations = await knex('anime_details')
      .select('language', 'name', 'overview')
      .where({
        animeId: data.id,
        language: language.length === 2
          ? language
          : 'en'
      })
    data.episodes = await knex('episode')
      .select('number', 'resolution', 'filename')
      .where({
        animeId: data.id
      })

    return data
  }
}

module.exports = (app, opts, done) => {
  app.route(getAnime)

  done()
}
