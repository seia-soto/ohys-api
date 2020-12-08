const fetch = require('node-fetch')

const { name, version } = require('../../package.json')
const debug = require('./debug')

const days = [
  '월', '화', '수', '목', '금', '토', '일', 'SP',
  '月', '火', '水', '木', '金', '土', '日', 'SP',
  'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN', 'SP'
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
    const linef = line.split()[0]

    debug('parsing current line:', line)

    // NOTE: if current line is representing day;
    if (days.indexOf(linef) > -1) {
      day = days.indexOf(linef) % 7

      debug('detected `day` format from current line and setting day to:', day)
    } else {
      const match = line.match(/(.*)\[(.*)\](.*)/)

      // NOTE: if there is correct format of anime name;
      if (match && match[1]) {
        debug('detected name format from the line')

        const [original, ...args] = match
        const [data, name, comment] = args
        let altName

        if (!name.match(/[a-zA-Z가-힣一-龠ぁ-ゔァ-ヴーａ-ｚＡ-Ｚ０-９々〆〤]/)) {
          debug('finding next field because current title does not have any alphabet')

          try {
            altName = data.match(/.*\[(.*)\]/)[1]
          } catch (error) {
            debug('supressing error:', error)
          }
        }

        schedules.push({
          year: opts.year,
          quarter: opts.quarter,
          day,
          name: altName || name || data,
          comment,
          original
        })
      }
    }
  }

  return schedules
}
