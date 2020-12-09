process.env.DEBUG = '*'

const getSchedule = require('./getScheduleCompatible')

getSchedule({
  year: 2017,
  quarter: 3
})
  .then(result => console.log(result))
