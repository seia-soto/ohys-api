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

    const { year, quarter, language = 'en' } = request.query

    if (!year || !quarter) return []

    const scheduledAnimes = await knex('anime')
      .select('*')
      .where({
        year,
        quarter
      })
      .whereNot({
        status: 'Ended'
      })
    const animes = []

    for (let i = 0, l = scheduledAnimes.length; i < l; i++) {
      const item = scheduledAnimes[i]

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
  app.route(getSchedules)

  done()
}
