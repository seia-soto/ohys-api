const debug = require('debug')

const pkg = require('../../package.json')

module.exports = name => {
  let loggerName = pkg.name

  if (name) {
    loggerName += ':' + name
  }

  return debug(loggerName)
}
