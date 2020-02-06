const utils = require('../utils')

module.exports = {
  method: 'get',
  fn: async ctx => {
    const startIdx = 25 * Number(ctx.params.page || 0)
    const results = await utils.database.knex('animes')
      .select('*')
      .whereBetween('id', [startIdx, startIdx + 25])

    ctx.body = await JSON.stringify(results)
  }
}
