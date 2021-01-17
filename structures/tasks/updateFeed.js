const { knex } = require('../database')
const { sha256 } = require('../hash')
const ohys = require('../ohys')
const {
  createLogger,
  normalizeFilename,
  updateAnimeOf
} = require('../utils')

const debug = createLogger('tasks/updateFeed')
let isTaskActive = 0

module.exports = async () => {
  'use strict'

  if (isTaskActive) {
    debug('function is already running from another call stack')

    return
  }

  // NOTE: mark this task has been started;
  isTaskActive = 1

  debug('updating feed')

  try {
    // NOTE: get missing items;
    const [lastItem] = await knex('episode')
      .select('hash')
      .orderBy('id', 'desc')
      .limit(1)
    const lastHash = (lastItem || {}).hash
    const missings = []

    for (let page = 0, feed = []; (feed = await ohys.getFeed({ page, prettify: 1 })).length; page++) {
      for (let i = 0, l = feed.length; i < l; i++) {
        feed[i].hash = sha256(feed[i].name)

        if (feed[i].hash === lastHash) {
          page = -1

          break
        }

        missings.push(feed[i])
      }

      if (page < 0) break
    }

    // NOTE: normalize the data list to object by series name;
    const animeIds = {}
    const insertions = []

    for (let i = 0, l = missings.length; i < l; i++) {
      const item = missings[l - i - 1]
      const data = ohys.parseTitle(item.name)

      animeIds[data.series] = animeIds[data.series] || await updateAnimeOf({ name: data.series })

      insertions.push({
        updatedAt: knex.fn.now(),
        animeId: animeIds[data.series],
        number: Number(String(data.episode).replace(/[^\d]/g, '')),
        resolution: data.resolution,
        filename: normalizeFilename(item.name),
        hash: item.hash
      })
    }

    debug('inserting episodes missing on database:', insertions.length)

    for (let i = 0, l = insertions.length; i < l; i += 5) {
      try {
        await knex('episode')
          .insert(insertions.slice(i, i + 5))
      } catch (error) {
        debug('error while inserting rows:', error)
      }
    }

    debug('updated feed')
  } catch (error) {
    debug('error while updating feed:', error)
  }

  isTaskActive = 0
}
