const database = require('../database')

module.exports = async () => {
  const updatingAnimes = await database.knex('animes')
    .where({
      isUpdating: true
    })
    .select('id')

  for (let i = 0, l = updatingAnimes.length; i < l; i++) {
    await database.knex('animes')
      .where({
        id: updatingAnimes[i].id
      })
      .update({
        isUpdating: false
      })
  }
}
