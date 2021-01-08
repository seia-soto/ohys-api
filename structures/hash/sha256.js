const crypto = require('crypto')

module.exports = text => crypto.createHash('sha256').update(text).digest('base64')
