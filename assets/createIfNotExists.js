const fs = require('fs')

const debug = require('./debug')
const getWorkspace = require('./getWorkspace')

module.exports = path => {
  path = path || getWorkspace()

  if (!fs.existsSync(path)) {
    debug('creating data directory because it does not exists')

    fs.mkdirSync(path)
  } else {
    if (!fs.lstatSync(path).isDirectory()) {
      debug('creating data directory because it does not exists')

      fs.mkdirSync(path)
    }
  }
}
