const fetchList = require('./list')

module.exports = async () => {
  const serialized = []

  let lastItemSize = 30
  let page = 1

  while (lastItemSize >= 30) {
    const items = await fetchList({
      query: '',
      page
    })

    for (let k = 0; k < items.serialized.length; k++) {
      await serialized.push(items.serialized[k])
    }

    lastItemSize = items.serialized.length
    page += 1
  }

  return serialized
}
