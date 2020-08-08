const fastify = require('fastify')

const utils = require('./utils')
const config = require('./config')

const app = fastify({
  logger: true
})
const debug = utils.createLogger()

module.exports = (async () => {
  try {
    await app.listen(config.port)

    debug('application is listening on port: ' + config.port)
  } catch (error) {
    debug('unexpected error occured while starting application: ' + error)

    process.exit(1)
  }
})()
