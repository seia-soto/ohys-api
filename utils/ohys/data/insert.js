const log = require('../../../log')
const database = require('../../database')
const patterns = require('../patterns')

module.exports = async items => {
  for (let i = 0; i < items.length; i++) {
    const [original, title, broadcaster, resolution, audioFormat, videoFormat] = await patterns.title.exec(items[i].name)
    const [series, episode] = await title.split(' - ')

    log(`inserting '${series}' position at ${episode}...`)

    await database.knex('animes')
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

  log('successfully done insertion.')
}
