const completeDownloadLink = require('./completeDownloadLink')

module.exports = item => {
  if (Array.isArray(item)) {
    for (let i = 0, l = item.length; i < l; i++) {
      item[i].directDownloadLink = completeDownloadLink(item[i].directDownloadLink)
    }
  } else if (typeof item === 'object') {
    item.directDownloadLink = completeDownloadLink(item.directDownloadLink)
  } else {
    item = completeDownloadLink(item)
  }

  return item
}
