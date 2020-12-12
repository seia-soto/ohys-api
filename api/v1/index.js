const animeHandler = require('./anime')
const schedulesHandler = require('./schedules')

module.exports = (app, opts, done) => {
  app.register(animeHandler, { prefix: '/anime' })
  app.register(schedulesHandler, { prefix: '/schedules' })

  done()
}
