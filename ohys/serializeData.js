const config = require('../config')
const serializeTitle = require('./serializeTitle')

module.exports = payload => {
  const item = serializeTitle(payload.t)

  item.originLink = `${config.ohys.domain}/t/${payload.a}`

  return item
}
