const createLogger = require('./createLogger')

const debug = createLogger('utils/retryable')

const retryable = async (task, opts) => {
  'use strict'

  opts = opts || {}
  opts.maxTries = opts.maxTries || 5

  let retries = 0

  try {
    const result = await task()

    return {
      status: true,
      resposne: result
    }
  } catch (error) {
    debug('unknown error occured while running retryable:', error)

    if (error) {
      retries++

      if (retries >= opts.maxTries) {
        return retryable()
      } else {
        return {
          stauts: false,
          response: error
        }
      }
    }
  }
}

module.exports = retryable
