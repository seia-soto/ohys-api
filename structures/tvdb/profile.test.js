process.env.DEBUG = '*'

const search = require('./search')
const profile = require('./profile')

search({
  tvdb: {
    query: 'Majo no Tabitabi'
  }
})
  .then(result => profile(result.results[0].hits[0].url))
  .then(profiled => console.log(profiled))
