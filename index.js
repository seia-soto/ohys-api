const fastify = require('fastify')

const api = require('./api')
const assets = require('./assets')
const database = require('./database')
const utils = require('./utils')
const worker = require('./worker')
const config = require('./config')

const app = fastify({
  logger: true
})
const debug = utils.createLogger()

// NOTE: Declare routings
app.register(api.v1, { prefix: 'v1' })

module.exports = (async () => {
  try {
    // NOTE: Tasks before boot
    await database.createTableIfNotExists()
    assets.createIfNotExists()
    worker.initialize()

    // NOTE: Finally boot-up application
    await app.listen(config.port)

    debug('application is listening on port: ' + config.port)
  } catch (error) {
    debug('unexpected error occured while starting application: ' + error)

    throw error
  }
})()
