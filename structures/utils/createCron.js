const schedule = require('node-schedule')

module.exports = async (rule, fn, useFirstRun) => {
  if (useFirstRun) {
    fn()
  }

  return schedule.scheduleJob(rule, fn)
}
