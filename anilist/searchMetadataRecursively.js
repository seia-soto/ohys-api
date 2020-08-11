const searchMetadata = require('./searchMetadata')

const searchMetadataRecursively = async title => {
  const { data } = await searchMetadata(title)

  if (!data.Page.media.length) {
    const fragments = title.split(' ')

    fragments.pop()

    return searchMetadataRecursively(fragments.join(' '))
  }

  return data
}

module.exports = searchMetadataRecursively
