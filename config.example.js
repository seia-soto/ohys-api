module.exports = {
  data: {
    base: './.data',
    posters: './.data/posters',
    torrents: './.data/torrents'
  },
  database: {
    client: 'sqlite3',
    connection: {
      filename: './.data/data.db',
      timezone: 'UTC'
    },
    useNullAsDefault: true
  }
}
