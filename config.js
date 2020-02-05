module.exports = {
  app: {
    port: 3172,
    request: {
      body: {
        multipart: true
      }
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
      filename: './resources/main.sqlite3'
    }
  },
  ohys: {
    refreshRate: 4 * 1000
  }
}
