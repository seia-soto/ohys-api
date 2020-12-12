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

    const scheduledAnimes = await knex('schedule')
      .select('animeId')
      .where({
        year,
        quarter
      })
    const animes = []

    for (let i = 0, l = scheduledAnimes.length; i < l; i++) {
      const item = scheduledAnimes[i]
      const [data] = await knex('anime')
        .select('*')
        .where({
          id: item.animeId,
          status: 'continuing'
        })

      if (!data) continue

      const details = await knex('anime_details')
        .select('language', 'title')
        .where({
          animeId: data.id
        })

      data.descriptions = details

      animes.push(data)
    }

    return animes
  }
}

module.exports = (app, opts, done) => {
  app.route(getSchedules)

  done()
}
