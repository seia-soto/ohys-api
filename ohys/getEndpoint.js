const config = require('../config')

module.exports = variant => {
  return config.ohys.domain + (config.ohys.endpoints[variant] || '')
}
