const log = require('../../../log')
const anilist = require('../../anilist')
const crypto = require('../../crypto')
const database = require('../../database')
const patterns = require('../patterns')

module.exports = async items => {
  const metaUpdateQueue = []

  for (let i = 0; i < items.length; i++) {
    let [original, series, broadcaster, resolution, audioFormat, videoFormat] = await patterns.titleSingleEpisode.exec(items[i].name)
    let episode = 0

    if (await patterns.title.test(items[i].name)) {
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
        original: items[i].name
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
