const log = require('../../../log')
const database = require('../../database')
const patterns = require('../patterns')

module.exports = async items => {
  for (let i = 0; i < items.length; i++) {
    let [original, series, broadcaster, resolution, audioFormat, videoFormat] = await patterns.titleSingleEpisode.exec(items[i].name)
    let episode = 0

    if (await patterns.title.test(items[i].name)) {
      [original, series, episode, broadcaster, resolution, audioFormat, videoFormat] = await patterns.title.exec(items[i].name)
    }

    log(`inserting '${series}' episode ${episode}...`)

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
