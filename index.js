const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')

const functions = require('./functions')
const utils = require('./utils')

const pkg = require('./package')
const config = require('./config')
const log = require('./log')

const app = new Koa()
const router = new Router()

router.all('/', async ctx => ctx.redirect('https://ohys.seia.io'))

utils.database.autofill()
utils.routing.autofill(router, functions)
utils.ohys.automate()

app
  .use(cors(config.app.cors))
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(config.app.port, () => log(`${pkg.name}@v${pkg.version} is listening at port ${config.app.port}.`))
