const debug = require('debug')

const utils = require('../utils')
const pkg = require('../package')

const log = debug(pkg.name + ':firstrun')

const firstrun = async () => {
  await utils.database.autofill()

  const items = await utils.ohys.fetch.allList()

  for (let i = 0; i < items.length; i++) {
    const [original, title, broadcaster, resolution, audioFormat, videoFormat] = await utils.ohys.patterns.title.exec(items[i].name)
    const [series, episode] = await title.split(' - ')

    log(`inserting '${series}' position at ${episode}...`)

    await utils.database.knex('animes')
      .insert({
        id: null,
        episode,
        series,
        link: items[i].url,
        resolution,
        audioFormat,
        videoFormat,
        broadcaster,
        original
      })
  }

  log('successfully done firstrun process.')

  process.exit(0)
}

firstrun()
