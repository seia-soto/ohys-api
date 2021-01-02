process.env.DEBUG = '*'

const getSchedule = require('./getSchedule')

const years = [new Date().getFullYear()]

for (let i = 0; i < 4; i++) {
  years.push(years[i] - 1)
}

const results = []

const test = async () => {
  for (let i = 0, l = years.length; i < l; i++) {
    const year = years[i]

    for (let k = 0; k < 4; k++) {
      const quarter = k + 1

      const data = await getSchedule({
        year,
        quarter
      })

      for (let n = 0, z = data.length; n < z; n++) {
        results.push(data[n])
      }
    }
  }

  console.log(JSON.stringify(results))
}

test()
