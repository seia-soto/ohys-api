const log = require('../../../log')
const crypto = require('../../crypto')
const database = require('../../database')
const fetch = require('../fetch')

class AnilistWorker {
  constructor (opts) {
    opts = opts || {}

    this.activeQueueSize = opts.activeQueueSize || 90
    this.queue = []

    setInterval(async () => {
      await this.activeWorker()
    }, 60 * 1000)
    setInterval(async () => {
      await this.findUnattributed()
    }, 60 * 60 * 1000)
  }

  enqueue (series) {
    log(`enqueued '${series}' for additional metadata.`)

    this.queue.push(series)
  }

  async activeWorker () {
    if (!this.queue.length) return

    log('activating worker at ' + Date.now())

    const sequence = await this.queue.splice(0, this.activeQueueSize)

    for (let i = 0; i < sequence.length; i++) {
      const series = sequence[i]
      const existingMeta = await database.knex('series')
        .select('id')
        .where({
          hash: crypto.hash.md5(series)
        })
      if (existingMeta.length) return

      log(`fetching and inserting metadata of '${sequence[i]}'...`)

      const metadata = await fetch.metadata(series)

      if (!metadata.notFound && !metadata.error) {
        await database.knex('series')
          .insert({
            id: null,
            hash: crypto.hash.md5(series),
            name: series,
            titleNative: metadata.title.native || 'N/A',
            status: metadata.status || 'N/A',
            description: (metadata.description || 'N/A').replace(/(<br>|\n)/gm, ' ').replace(/(<[\w/^>]*>)?/gm, ''),
            coverImageURL: metadata.coverImage.extraLarge || 'N/A'
          })
      }
    }
  }

  async findUnattributed () {
    const list = []
    const data = await database.knex('animes')
      .select('series')

    for (let k = 0; k < data.length; k++) {
      const existingMeta = await database.knex('series')
        .select('id')
        .where({
          hash: crypto.hash.md5(data[k].series)
        })

      if (!list.includes(data[k].series) && !existingMeta.length) {
        list.push(data[k].series)
        this.enqueue(data[k].series)
      }
    }
  }
}

const worker = new AnilistWorker()

module.exports = worker
