const fetch = require('node-fetch')

const { name, version } = require('../../package.json')
const debug = require('./debug')

const days = [
  '월', '화', '수', '목', '금', '토', '일', 'SP',
  '月', '火', '水', '木', '金', '土', '日', 'SP',
  'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'SP'
]
const dividers = [
  '/', '[', ']'
]
const comments = [
  '//', '/{', '/ [', ' / '
]

module.exports = async (opts = {}) => {
  opts.repo = opts.repo || 'ohyongslck/annie'
  opts.branch = opts.branch || 'master'
  opts.year = opts.year || new Date().getFullYear()
  opts.quarter = opts.quarter || 1

  // NOTE: build url;
  const url = `https://raw.githubusercontent.com/${opts.repo}/${opts.branch}/${opts.year}@${opts.quarter}`

  debug('requesting to:', url)

  // NOTE: request;
  const res = await fetch(url, {
    headers: {
      'User-Agent': `Seia-Soto/${name} v${version} (https://github.com/Seia-Soto)`
    }
  })
  const text = await res.text()
  const lines = text.split('\n')

  // NOTE: parse data;
  const schedules = []
  let day = -1

  for (let i = 0, l = lines.length; i < l; i++) {
    const line = lines[i]

    debug('parsing current line:', line)

    // NOTE: if current line is representing day;
    for (let k = 0, s = days.length; k < s; k++) {
      if (line.startsWith(days[k])) {
        day = k % 8

        debug('detected `day` format from current line and setting day to:', day)

        continue
      }
    }

    let pruned = (' ' + line).slice(1)
    let comment = ''

    debug('replacing comments cases:', comments.join(', '))

    for (let k = 0, s = comments.length; k < s; k++) {
      [pruned, comment] = pruned.split(comments[k])
    }

    const tokens = pruned
      .split('')
      .reverse()
    const dividingIdx = {
      start: -1,
      end: -1
    }

    debug('matching title index with dividers:', dividers.join(', '))

    for (let k = 0, s = tokens.length; k < s; k++) {
      const token = tokens[k]

      if (dividers.indexOf(token) > -1) {
        if (dividingIdx.end > -1 && dividingIdx.end !== s - k) { // NOTE: prevent commenting heuristically;
          dividingIdx.start = s - k

          break
        } else {
          dividingIdx.end = s - k - 1
        }
      }
    }

    if (dividingIdx.start < 0) {
      debug('skipping current line because no case were found')

      continue
    }

    const title = pruned
      .slice(dividingIdx.start, dividingIdx.end)
      .trim()

    if (title && title.match(/[a-zA-Z가-힣一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤]/u)) {
      debug('title rule has matched:', title)

      schedules.push({
        year: opts.year,
        quarter: opts.quarter,
        day,
        name: title,
        comment,
        original: line
      })
    }
  }

  return schedules
}
