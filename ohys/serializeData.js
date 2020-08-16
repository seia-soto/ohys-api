const serializeTitle = require('./serializeTitle')

module.exports = payload => {
  const item = serializeTitle(payload.t)

  item.directDownloadLink = payload.a

  return item
}
