module.exports = data => {
  const keys = Object.keys(data)
  const form = []

  for (let i = 0, l = keys.length; i < l; i++) {
    form.push(encodeURIComponent(keys[i]) + '=' + encodeURIComponent(data[keys[i]]))
  }

  return form.join('&')
}
