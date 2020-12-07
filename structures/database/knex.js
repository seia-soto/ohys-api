const knex = require('knex')

const { database: config } = require('../../config')

module.exports = knex(config)
