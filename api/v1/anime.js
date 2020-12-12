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

    const [data] = await knex('anime')
      .select('*')
      .where({
        id
      })

    if (!data) {
      throw new Error(`Missing item for id: ${id}`)
    }

    const details = await knex('anime_details')
      .select('language', 'title', 'description')
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
