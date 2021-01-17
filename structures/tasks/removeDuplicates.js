const { knex } = require('../database')
const {
  createLogger
} = require('../utils')

const debug = createLogger('tasks/updateDuplicates')
let isTaskActive = 0

module.exports = async () => {
  'use strict'

  if (isTaskActive) {
    debug('function is already running from another call stack')

    return
  }

  // NOTE: mark this task has been started;
  isTaskActive = 1

  debug('finding and removing duplicates')

  try {
    const items = await knex('episode')
      .select('id', 'hash')
    const distincts = {}

    for (let i = 0, l = items.length; i < l; i++) {
      const item = items[i]

      distincts[item.hash] = item.id || item.hash
    }
    for (const hash in distincts) {
      await knex('episode')
        .where({ hash })
        .whereNot({ id: distincts[hash] })
        .del()
    }

    debug('removed duplicates')
  } catch (error) {
    debug('error while updating feed:', error)
  }

  isTaskActive = 0
}
