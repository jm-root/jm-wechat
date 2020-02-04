const MS = require('jm-ms-core')
const help = require('./help')
const oauth = require('./oauth')
const api = require('./api')

let ms = new MS()
module.exports = function (opts = {}) {
  let service = this
  let router = ms.router()
  router
    .use(help(service))
    .use('/oauth', oauth(service, opts))
    .use(api(service, opts))
  return router
}
