const { knex } = require('../database')
const ohys = require('../ohys')
const {
  createLogger,
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

  // NOTE: get missing items;
  const [lastItem] = await knex('episode')
    .select('filename')
    .orderBy('id', 'desc')
    .limit(1)
  const missings = []

  for (let page = 0, feed = []; (feed = await ohys.getFeed({ page, prettify: 1 })).length; page++) {
    for (let i = 0, l = feed.length; i < l; i++) {
      if (feed[i].name === (lastItem || {}).filename) {
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
      updatedAt: Date.now(),
      animeId: animeIds[data.series],
      number: data.episode,
      resolution: data.resolution,
      filename: item.name
    })
  }

  debug('inserting episodes missing on database:', insertions.length)

  for (let i = 0, l = insertions.length; i < l; i += 5) {
    await knex('episode')
      .insert(insertions.slice(i, i + 5))
  }

  debug('updated feed')

  isTaskActive = 0
}
