const utils = require('../utils')

module.exports = {
  method: 'get',
  fn: async ctx => {
    const items = await utils.database.knex('animes')
      .select('id')
    const range = 25 * Number(ctx.request.query.page || 1)
    const results = await utils.database.knex('animes')
      .select('*')
      .whereBetween('id', [items.length - range, items.length - range + 25])
      .orderBy('id', 'desc')

    ctx.body = JSON.stringify(results)
  }
}
