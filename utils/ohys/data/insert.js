const log = require('../../../log')
const anilist = require('../../anilist')
const crypto = require('../../crypto')
const database = require('../../database')
const patterns = require('../patterns')

module.exports = async items => {
  const metaUpdateQueue = []

  for (let i = 0; i < items.length; i++) {
    const serializable = {
      asSingle: await patterns.titleSingleEpisode.test(items[i].name),
      asEpisode: await patterns.title.test(items[i].name)
    }

    let original = items[i].name
    let series = ''
    let broadcaster = ''
    let resolution = ''
    let audioFormat = ''
    let videoFormat = ''
    let episode = 0

    if (serializable.asSingle) {
      [original, series, broadcaster, resolution, audioFormat, videoFormat] = await patterns.titleSingleEpisode.exec(items[i].name)
    }
    if (serializable.asEpisode) {
      [original, series, episode, broadcaster, resolution, audioFormat, videoFormat] = await patterns.title.exec(items[i].name)
    }

    log(`inserting '${series}' episode ${Number(episode)}...`)

    await database.knex('animes')
      .insert({
        id: null,
        hash: await crypto.hash.md5(await JSON.stringify(items[i])),
        episode: Number(episode || -1),
        series,
        link: items[i].url,
        resolution,
        audioFormat,
        videoFormat,
        broadcaster,
        original
      })

    const existingMeta = await database.knex('series')
      .select('id')
      .where({
        hash: crypto.hash.md5(series)
      })
    if (!existingMeta.length && !metaUpdateQueue.includes(series)) {
      metaUpdateQueue.push(series)
      anilist.worker.enqueue(series)
    }
  }

  log(`successfully inserted ${items.length} item(s).`)
}
