const animes = require('./animes')

module.exports = (app, opts, done) => {
  app.get('/animes/list', animes.list)
  app.get('/animes/metadata', animes.metadata)

  done()
}
