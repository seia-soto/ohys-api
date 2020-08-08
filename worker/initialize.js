const start = require('./start')

module.exports = () => {
  const workerId = process.env.pm_id

  // NOTE: Check if the process was launched via PM2 and the process is first process.
  if (workerId) {
    // NOTE: The env vars' type is always string
    if (workerId === '0') {
      start()
    }
  } else {
    // NOTE: Should enable worker tasks on this process since the process cluter count is 1.
    start()
  }
}
