const useBody = require('koa-body')

const config = require('../../config')
const log = require('../../log')

const autofill = (router, routes, prefix) => {
  prefix = prefix || ''

  if (typeof routes === 'object') {
    if (typeof routes.fn === 'function') {
      log(`autofilled route for ${routes.method.toUpperCase()}:${prefix}.`)

      if (['all', 'post', 'put', 'patch'].includes(routes.method)) {
        // NOTE: <https://specs.openstack.org/openstack/api-wg/guidelines/http/methods.html>
        router[routes.method](prefix, useBody(config.request.body), routes.fn)
      } else {
        router[routes.method](prefix, routes.fn)
      }
    } else {
      const sub = Object.keys(routes)

      for (let k = 0; k < sub.length; k++) {
        autofill(router, routes[sub[k]], prefix + '/' + sub[k])
      }
    }
  }
}

module.exports = autofill
