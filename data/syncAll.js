const ohys = require('../ohys')
const syncAnimes = require('./syncAnimes')
const syncEpisodes = require('./syncEpisodes')

module.exports = async animes => {
  if (!animes || !animes.length) {
    animes = await ohys.getAllList()
  }

  await syncAnimes(animes)
  await syncEpisodes(animes)
}
