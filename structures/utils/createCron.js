const schedule = require('node-schedule')

module.exports = async (rule, fn, opts = {}) => {
  if (opts.useFirstRun) {
    if (opts.waitFirstRun) {
      await fn()
    } else {
      fn()
    }
  }

  return schedule.scheduleJob(rule, fn)
}
