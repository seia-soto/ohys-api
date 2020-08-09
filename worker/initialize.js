const data = require('../data')
const debug = require('./debug')

module.exports = async () => {
  const workerId = process.env.pm_id

  debug('retrieving the environment variable of PM2: (pm_id)' + workerId)

  // NOTE: Check if the process was launched via PM2 and the process is first process.
  if (workerId) {
    // NOTE: The env vars' type is always string
    if (workerId === '0') {
      debug('starting sync automation')

      await data.syncAll()
      // data.syncAutomatic()
    }

    debug('found the environment variable and it was possible to set the workerId, but this process is not the first')
  } else {
    debug('cannot retrieve the environment variable and set the workerId for this proceses')
    debug('starting sync automation')
    // NOTE: Should enable worker tasks on this process since the process cluter count is 1.
    await data.syncAll()
    // data.syncAutomatic()
  }
}
