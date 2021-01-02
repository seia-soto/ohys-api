const debug = require('./debug')

module.exports = text => {
  'use strict'

  if (!text) return

  const expression = /(?:\[([^\r\n]*)\][\W]?)?(?:(?:([^\r\n]+?)(?: - ([0-9.]+?(?: END)?))?)[\W]?[(|[]([^\r\n(]+)? (\d+x\d+|\d{3,}\w)? ([^\r\n]+)?[)\]][^.\r\n]*(?:\.([^\r\n.]*)(?:\.[\w]+)?)?)$/gi
  const result = {}
  const keys = [
    'original',
    'provider',
    'series',
    'episode',
    'channel',
    'resolution',
    'audioFormat',
    'videoFormat'
  ]

  try {
    const data = expression.exec(text)

    // NOTE: Fill out `provider`
    data[1] = data[1] || 'Ohys-Raws'
    // NOTE: Fill out `episode`.
    data[3] = data[3] || -1
    // NOTE: Resolve non-standard `resolution` value.
    if (!/\d+x\d+/g.test(data[5])) {
      const extract = /(\d{3,})\w/g.exec(data[5])
      const width = Number(extract[1])

      if (!isNaN(width)) {
        // NOTE: Resolve 3:4 ratio.
        if (width === 480) {
          data[5] = '640x480'
        } else {
          // NOTE: Automatic calcutation of 16:9 ratio.
          data[5] = `${Math.floor(width / 9 * 16)}x${width}`
        }
      }
    }
    // NOTE: Set default `videoFormat` to `mp4`.
    if (!data[7] || data[7] === 'torrent') {
      data[7] = 'mp4'
    }

    for (let i = 0, l = keys.length; i < l; i++) {
      result[keys[i]] = data[i]
    }

    return result
  } catch (error) {
    debug('error during parsing title: ' + text)

    return {
      error: 'unexpected-case'
    }
  }
}
