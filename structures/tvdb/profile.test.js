process.env.DEBUG = '*'

const profile = require('./profile')

profile('/series/the-journey-of-elaina')
  .then(result => console.log(result))
