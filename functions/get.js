const utils = require('../utils')

module.exports = {
  method: 'get',
  fn: async ctx => {
    const endIdx = 25 * Number(ctx.request.query.page || 1)
    const results = await utils.database.knex('animes')
      .select('*')
      .whereBetween('id', [endIdx - 25, endIdx])

    ctx.body = await JSON.stringify(results)
  }
}
