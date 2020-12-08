process.env.DEBUG = '*'

const search = require('./search')

search({
  tvdb: {
    query: 'Majo no Tabitabi'
  }
})
  .then(result => console.log(result))
