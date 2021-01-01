process.env.DEBUG = '*'

const getFeed = require('./getFeed')
const parseTitle = require('./parseTitle')

getFeed({
  prettify: 1
})
  .then(result => {
    for (let i = 0, l = result.length; i < l; i++) {
      const title = result[i].name

      console.log(parseTitle(title))
    }
  })
