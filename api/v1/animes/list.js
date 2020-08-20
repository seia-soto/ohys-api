const database = require('../../../database')
const ohys = require('../../../ohys')

module.exports = async (request, reply) => {
  const page = Number(request.query.page)

  if (isNaN(page) || page < 0) {
    return {}
  }

  const [
    {
      id: lastId
    }
  ] = await database.knex('entries')
    .select('id')
    .limit(1)
    .orderBy('id', 'desc')
  const list = await database.knex('entries')
    .select('*')
    .whereBetween('id', [lastId - (page * 30), lastId - ((page - 1) * 30)])
    .limit(30)
    .orderBy('id', 'desc')

  return ohys.completeDownloadLinkDynamically(list)
}
