const utils = require('../utils')

const firstrun = async () => {
  await utils.database.autofill()
  await utils.ohys.data.insert(await utils.ohys.fetch.allList().reverse())

  process.exit(0)
}

firstrun()
