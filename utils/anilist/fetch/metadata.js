const request = require('request-promise')

const config = require('../../../config')

module.exports = async series => {
  try {
    if (!series) return {}

    const query = `
query ($id: Int, $page: Int, $perPage: Int, $search: String) {
  Page (page: $page, perPage: $perPage) {
    pageInfo {
      total
      currentPage
      lastPage
      hasNextPage
      perPage
    }
    media (id: $id, search: $search) {
      id
      title {
        native
      }
      status
      description
      coverImage {
        extraLarge
      }
    }
  }
}
` // NOTE: `media` is an array.
    const variables = {
      search: series,
      page: 1,
      perPage: 1
    }

    const requestOptions = {
      method: 'POST',
      uri: config.anilist.api,
      body: {
        query, variables
      },
      json: true
    }
    const data = await request(requestOptions)

    if (data.data.Page.media.length) {
      return data.data.Page.media[0]
    } else {
      return {
        notFound: true
      }
    }
  } catch (error) {
    return {
      error
    }
  }
}
