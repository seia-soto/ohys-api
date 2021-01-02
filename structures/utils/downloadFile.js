const { createWriteStream } = require('fs')
const { pipeline } = require('stream')
const { promisify } = require('util')
const fetch = require('node-fetch')
const createLogger = require('./createLogger')

const streamPipeline = promisify(pipeline)
const debug = createLogger('utils/downloadFile')

module.exports = async (url, path, useExtension) => {
  'use strict'

  debug('downloading url:', url)

  const res = await fetch(url)

  if (!res.ok) return false

  if (useExtension) {
    debug('appending the url with extension')

    path += '.' + url.split('.').pop()
  }

  debug('writing file to:', path)

  await streamPipeline(res.body, createWriteStream(path))
}
