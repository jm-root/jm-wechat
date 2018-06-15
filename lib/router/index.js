const MS = require('jm-ms-core')
const wraper = require('./wraper')
const help = require('./help')
const oauth = require('./oauth')
const api = require('./api')

let ms = new MS()
module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()
  service.wrapRoute = wraper(service)
  router
    .use(help(service))
    .use('/oauth', oauth(service, opts))
    .use(api(service, opts))
  return router
}
