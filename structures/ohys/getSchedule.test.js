process.env.DEBUG = '*'

const getSchedule = require('./getSchedule')

getSchedule()
  .then(result => console.log(result))
