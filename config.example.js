module.exports = {
  app: {
    port: 9012
  },
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
  },
  tasks: {
    updateSchedule: 1
  }
}
