const getList = require('./getList')

const log = require('./log')

module.exports = async () => {
  log('loading all items')

  const serialized = []
  let currentPage = 0
  let lastItemSize = 30

  while (lastItemSize >= 30) {
    const { data, error } = await getList({
      page: currentPage
    })

    if (!error) {
      lastItemSize = data.length

      for (let i = 0, l = data.length; i < l; i++) {
        serialized.push(data[i])
      }
    }

    currentPage++
  }

  return {
    data: serialized
  }
}
