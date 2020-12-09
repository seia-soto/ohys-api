module.exports = {
  data: {
    base: './.data',
    posters: './.data/posters',
    covers: './.data/covers',
    torrents: './.data/torrents'
  },
  database: {
    client: 'sqlite3',
    connection: {
      filename: './.data/data.db'
    },
    useNullAsDefault: true
  }
}
