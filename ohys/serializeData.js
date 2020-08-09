const config = require('../config')
const serializeTitle = require('./serializeTitle')

module.exports = payload => {
  const item = serializeTitle(payload.t)

  item.originLink = `${config.ohys.domain}/t/${payload.a}`

  return {
    name: item.series,
    originalFileName: item.original || '',
    provider: item.provider || '',
    channel: item.channel || '',
    resolution: item.resolution || '',
    audioFormat: item.audioFormat || '',
    videoFormat: item.videoFormat || ''
  }
}
