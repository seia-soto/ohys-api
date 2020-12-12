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
    const { id } = request.query

    if (!id) return {}

    const [data] = await knex('anime')
      .select('*')
      .where({
        id
      })

    if (!data) {
      throw new Error(`Missing item for id: ${id}`)
    }

    const details = await knex('anime_details')
      .select('language', 'name', 'overview')
      .where({
        animeId: data.id
      })

    data.descriptions = details

    return data
  }
}

module.exports = (app, opts, done) => {
  app.route(getAnime)

  done()
}
