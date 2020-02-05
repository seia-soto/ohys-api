const utils = require('../utils')

module.exports = {
  method: 'post',
  fn: async ctx => {
    let results = []

    if (ctx.request.body.keyword) {
      results = await utils.database.knex('animes')
        .select('*')
        .where(ctx.request.body.scope || 'series', 'like', `%${ctx.request.body.keyword}%`)
    }

    ctx.body = await JSON.stringify(results)
  }
}
