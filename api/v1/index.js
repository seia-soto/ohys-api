const animeHandler = require('./anime')
const schedulesHandler = require('./schedules')
const searchHandler = require('./search')

module.exports = (app, opts, done) => {
  app.register(animeHandler, { prefix: '/anime' })
  app.register(schedulesHandler, { prefix: '/schedules' })
  app.register(searchHandler, { prefix: '/search' })

  done()
}
