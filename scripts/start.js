const fastify = require('fastify')
const fs = require('fs')
const path = require('path')
const qs = require('qs')
const api = require('../api')
const structures = require('../structures')
const config = require('../config')
const debug = require('./debug')

module.exports = (async () => {
  'use strict'

  debug('starting the application')

  const requiredDirectories = [
    config.data.base,
    config.data.torrents
  ]

  debug('checking if data directories are ready')

  for (let i = 0, l = requiredDirectories.length; i < l; i++) {
    const directory = path.join(__dirname, '..', requiredDirectories[i])

    debug('checking if directory exists:', directory)

    if (!fs.existsSync(directory)) {
      debug('creating:', directory)

      fs.mkdirSync(directory)
    }
  }

  // NOTE: required tasks;
  await structures.database.createTables()

  // NOTE: api;
  debug('starting api server')

  const app = fastify({
    querystringParser: q => qs.parse(q)
  })

  app.get('/', async (req, reply) => reply.redirect('https://github.com/Seia-Soto/ohys-api'))

  const versions = Object.keys(api)

  for (let i = 0, l = versions.length; i < l; i++) {
    const version = versions[i]

    debug('registering api version:', version)

    app.register(api[version], { prefix: '/api/' + version })
  }

  debug('listening on port:', config.app.port)

  try {
    await app.listen(config.app.port)
  } catch (error) {
    debug('got error while processing requests:', error)
  }

  if (process.env.API_ONLY) return

  // NOTE: code;
  debug('loading scheduled tasks')

  const schedulers = {}

  schedulers.ohys = {}

  // NOTE: update schedule every hour;
  if (config.tasks.updateSchedule) {
    schedulers.ohys.schedule = await structures.utils.createCron(
      '0 * * * *',
      structures.tasks.updateSchedule,
      config.tasks.updateSchedule
    )
  }
  // NOTE: update feed every minute;
  if (config.tasks.updateFeed) {
    schedulers.ohys.feed = structures.utils.createCron(
      '* * * * *',
      structures.tasks.updateFeed,
      config.tasks.updateFeed
    )
  }
})()
