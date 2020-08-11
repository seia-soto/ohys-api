const debug = require('./debug')

module.exports = text => {
  if (typeof text !== 'string' || !text) {
    return {
      error: 'TypeError: The name of file should be string to be parsed.'
    }
  }

  const expression = /(?:\[([^\r\n\]]*)\][\W]?)?(?:(?:([^\r\n]+?)(?: - ([\d]+?))?)[\W]?[(|[]([^\r\n(]+)? (\d+x\d+|\d+&\d+|\d{3,}\w)? ([^\r\n]+)?[)\]][^.\r\n]*(?:\.([^\r\n.]*)(?:\.[\w]+)?)?)$/gi
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
    data[3] = data[3] || 'n/a'
    // NOTE: Resolve non-standard `resolution` value.
    if (!/\d+x\d+/g.test(data[5])) {
      const extract = /(?:x|&)+(\d{3,})/g.exec(data[5])
      const width = Number(extract[1])

      if (!isNaN(width)) {
        if (width === 480) {
          // NOTE: Resolve 3:4 ratio.
          data[5] = '640x480'
        } else if (data[5].includes('&')) {
          // NOTE: Resolve multiple resolution values.
          data[5] = data[5].split('&').join(';')
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
      error: 'Unexpected case found while parsing title.'
    }
  }
}
