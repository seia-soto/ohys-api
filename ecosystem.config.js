module.exports = {
  apps: [
    {
      name: 'ohys-api',
      script: './index.js',
      watch: true,
      env: {
        DEBUG: '*'
      },
      env_production: {
        DEBUG: 'ohys-api'
      }
    }
  ]
}
