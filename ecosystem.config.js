module.exports = {
  apps: [
    {
      name: 'ohys-api-worker',
      script: './scripts/start.js',
      watch: false,
      env: {
        DEBUG: '*'
      },
      env_production: {
        DEBUG: 'ohys-api'
      }
    }
  ]
}
