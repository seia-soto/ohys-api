module.exports = {
  app: {
    port: 3172
  },
  database: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'your_database_user',
      password: 'your_database_password',
      database: 'ohys'
    }
  },
  ohys: {
    refreshRate: 30 * 1000
  }
}
