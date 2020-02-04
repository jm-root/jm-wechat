const _ = require('lodash')
const MS = require('jm-ms-core')
let ms = new MS()

module.exports = function (service) {
  let getUser = async opts => {
    let api = service.api
    let doc = await api.getUser(opts.params.openid)
    return doc
  }

  let createQRCode = async opts => {
    let api = service.api
    let limit = opts.data.limit || false
    let expire = opts.data.expire || 0
    let scene = opts.data.scene || 0
    _.isNumber(expire) && (expire = Number(expire))
    _.isNumber(scene) && (scene = Number(scene))
    let doc = null
    if (limit) {
      doc = api.createLimitQRCode(scene)
    } else {
      doc = api.createTmpQRCode(scene, expire)
    }
    return doc
  }

  let getQRCode = async opts => {
    let api = service.api
    let uri = await api.showQRCodeURL(opts.params.ticket)
    return { uri }
  }

  let router = ms.router()
  router
    .add('/users/:openid', 'get', getUser)
    .add('/qrcodes', 'post', createQRCode)
    .add('/qrcodes/:ticket', 'get', getQRCode)
  return router
}
