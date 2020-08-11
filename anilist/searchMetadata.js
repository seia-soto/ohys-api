const debug = require('./debug')
const queryGQL = require('./queryGQL')

module.exports = async title => {
  debug('searching anime metadata on anilist api: ' + title)

  const query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    media (id: $id, search: $search, type: ANIME) {
      id
      idMal
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      description
      season
      seasonYear
      type
      format
      status
      episodes
      duration
      chapters
      volumes
      isAdult
      genres
      source
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
      }
    }
  }
}
  `
  const variables = {
    search: title,
    page: 1,
    perPage: 1
  }

  const result = await queryGQL(query, JSON.stringify(variables))

  return result
}
