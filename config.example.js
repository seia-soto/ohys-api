module.exports = {
  app: {
    port: 9012
  },
  ohys: {
    getScheduleInRecentYears: 4
  },
  data: {
    base: './.data',
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
    updateSchedule: {
      useFirstRun: 1,
      waitFirstRun: 1
    }
  },
  externals: {
    tmdb: {
      v3ApiKey: ''
    }
  }
}
