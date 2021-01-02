const { knex } = require('../../structures/database')

const getSchedules = {
  method: 'GET',
  url: '/',
  schema: {
    query: {
      year: {
        type: 'integer'
      },
      quarter: {
        type: 'integer'
      }
    }
  },
  handler: async (request, reply) => {
    'use strict'

    const { year, quarter, language = 'us' } = request.query

    if (!year || !quarter) return []

    const scheduledAnimes = await knex('anime')
      .select('*')
      .where({
        year,
        quarter
      })
    const animes = []

    for (let i = 0, l = scheduledAnimes.length; i < l; i++) {
      const item = scheduledAnimes[i]

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
  app.route(getSchedules)

  done()
}
