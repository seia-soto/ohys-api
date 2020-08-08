const healthCheck = require('./healthCheck')

module.exports = (app, opts, done) => {
  app.get('/healthCheck', healthCheck)

  done()
}
