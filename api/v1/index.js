const animeHandler = require('./anime')
const schedulesHandler = require('./schedules')
const searchHandler = require('./search')
const feedHandler = require('./feed')

module.exports = (app, opts, done) => {
  app.register(animeHandler, { prefix: '/anime' })
  app.register(schedulesHandler, { prefix: '/schedules' })
  app.register(searchHandler, { prefix: '/search' })
  app.register(feedHandler, { prefix: '/feed' })

  done()
}
