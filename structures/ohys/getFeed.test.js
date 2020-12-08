process.env.DEBUG = '*'

const getFeed = require('./getFeed')

getFeed({
  prettify: 1
})
  .then(result => console.log(result))
