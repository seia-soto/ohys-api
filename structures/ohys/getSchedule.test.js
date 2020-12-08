process.env.DEBUG = '*'

const getSchedule = require('./getSchedule')

getSchedule({
  year: 2020,
  quarter: 4
})
  .then(result => console.log(result))
