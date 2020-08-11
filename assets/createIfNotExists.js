const fs = require('fs')

const debug = require('./debug')
const getWorkspace = require('./getWorkspace')

module.exports = () => {
  const workspace = getWorkspace()

  if (!fs.existsSync(workspace)) {
    debug('creating data directory because it does not exists')

    fs.mkdirSync(workspace)
  } else {
    if (!fs.lstatSync(workspace).isDirectory()) {
      debug('creating data directory because it does not exists')

      fs.mkdirSync(workspace)
    }
  }
}
