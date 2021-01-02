module.exports = {
  app: {
    port: 9012
  },
  ohys: {
    getScheduleInRecentYears: 4,
    getDataOfScheduleIn: 1000 * 60 * 60 * 24 // NOTE: 1 day
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
    },
    updateFeed: {
      useFirstRun: 1
    }
  },
  externals: {
    tmdb: {
      v3ApiKey: ''
    }
  }
}
