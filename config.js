module.exports = {
  port: 5000,
  ohys: {
    domain: 'https://eu.ohys.net',
    endpoints: {
      api: '/t/json.php'
    },
    sync: {
      interval: 5 * 1000,
      batchQuerySize: 45
    }
  },
  anilist: {
    api: 'https://graphql.anilist.co'
  },
  database: {
    client: 'sqlite3',
    connection: {
      filename: '.data.db'
    },
    useNullAsDefault: true
  }
}
