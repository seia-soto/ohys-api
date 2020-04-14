module.exports = {
  app: {
    port: 3172,
    request: {
      body: {
        multipart: true
      }
    },
    cors: {
      origin: 'http://localhost:3000'
    }
  },
  database: {
    /* MySQL
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'ohys'
    }
    */
    client: 'sqlite3',
    connection: {
      filename: './bin/main.db'
    }
  },
  ohys: {
    refreshRate: 30 * 1000
  },
  anilist: {
    api: 'https://graphql.anilist.co',
    refreshRate: 2 * 60 * 60 * 1000
  }
}
