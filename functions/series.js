const utils = require('../utils')

module.exports = {
  method: 'post',
  fn: async ctx => {
    let results = []

    if (ctx.request.body.series) {
      results = await utils.database.knex('series')
        .select('*')
        .where({
          name: ctx.request.body.series
        })
    }

    ctx.body = await JSON.stringify(results)
  }
}
