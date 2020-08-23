const database = require('../../../database')
const ohys = require('../../../ohys')

module.exports = async (request, reply) => {
  const {
    name
  } = request.query

  if (!name || !name.length) {
    return {}
  }

  const [data] = await database.knex('animes')
    .select('*')
    .where({ name })
  const episodes = await database.knex('entries')
    .select('*')
    .where({ animeName: name })

  data.episodes = ohys.completeDownloadLinkDynamically(episodes)

  reply.send(data)
}
