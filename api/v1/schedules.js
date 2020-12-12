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
    const { year, quarter } = request.query

    const scheduledAnimes = await knex('anime')
      .select('*')
      .where({
        year,
        quarter
      })
    const animes = []

    for (let i = 0, l = scheduledAnimes.length; i < l; i++) {
      const item = scheduledAnimes[i]
      const details = await knex('anime_details')
        .select('language', 'name')
        .where({
          animeId: item.id
        })

      item.overview = details

      animes.push(item)
    }

    return animes
  }
}

module.exports = (app, opts, done) => {
  app.route(getSchedules)

  done()
}
