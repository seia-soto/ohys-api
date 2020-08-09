const debug = require('./debug')
const getList = require('./getList')

module.exports = async () => {
  const results = []

  let page = 0
  let lastResultLength = -1

  debug('getting all file metadata from ohys JSON api')

  while (lastResultLength) {
    debug('downloading metadata at page: ' + page)

    const data = await getList({
      page
    })

    for (let i = 0, l = data.length; i < l; i++) {
      results.push(data[i])
    }

    lastResultLength = data.length

    page++
  }

  return results
}
