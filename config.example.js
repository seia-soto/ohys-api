module.exports = {
  app: {
    port: 9012
  },
  ohys: {
    getScheduleInRecentYears: 1,
    getDataOfScheduleIn: 1000 * 60 * 60 * 24 // NOTE: 1 day
  },
  data: {
    base: './.data',
    torrents: './.data/torrents'
  },
  database: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      database: ''
    },
    useNullAsDefault: true
  },
  tasks: {
    removeDuplicates: {
      useFirstRun: 1,
      waitFirstRun: 1
    },
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
