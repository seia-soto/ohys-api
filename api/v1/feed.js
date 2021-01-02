const { knex } = require('../../structures/database')

const getFeed = {
  method: 'GET',
  url: '/',
  schema: {
    query: {
      page: {
        type: 'integer'
      }
    }
  },
  handler: async (request, reply) => {
    'use strict'

    const { page = 0, language = 'en' } = request.query

    const episodes = await knex('episode')
      .select('*')
      .orderBy('id', 'desc')
      .limit(35)
      .offset(page * 35)

    if (!episodes.length) return { episodes: [] }

    const animes = {}

    for (let i = 0, l = episodes.length; i < l; i++) {
      const item = episodes[i]

      if (animes[item.animeId]) continue

      const [anime] = await knex('anime')
        .select('*')
        .where({
          id: item.animeId
        })
      anime.translations = await knex('anime_details')
        .select('language', 'name')
        .where({
          animeId: item.animeId,
          language: language.length === 2
            ? language
            : 'en'
        })

      animes[item.animeId] = anime
    }

    return {
      episodes,
      animes
    }
  }
}

module.exports = (app, opts, done) => {
  app.route(getFeed)

  done()
}
