module.exports = {
  port: 5000,
  ohys: {
    domain: 'https://eu.ohys.net',
    endpoints: {
      api: '/t/json.php'
    },
    sync: {
      interval: 30 * 1000,
      batchQuerySize: 45,
      skipFirstTimeEnsurement: true,
      torrentMetadata: true,
      saveTorrentFiles: false,
      animeMetadata: true
    }
  },
  anilist: {
    api: 'https://graphql.anilist.co',
    sync: {
      interval: 3 * 60 * 60 * 1000
    }
  },
  database: {
    client: 'sqlite3',
    connection: {
      filename: '.assets/.data.db'
    },
    useNullAsDefault: true
  }
}
