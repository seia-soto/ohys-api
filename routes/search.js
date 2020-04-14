const utils = require('../utils')

module.exports = {
  method: 'post',
  fn: async ctx => {
    let searchString = `%${ctx.request.body.keyword}%`
    let results = []

    if (ctx.request.body.exact) {
      searchString = ctx.request.body.keyword
    }

    if (ctx.request.body.keyword) {
      results = await utils.database.knex('animes')
        .select('*')
        .where(ctx.request.body.scope || 'series', 'like', searchString)
        .orderBy('id', 'desc')
    }

    ctx.body = JSON.stringify(results)
  }
}
