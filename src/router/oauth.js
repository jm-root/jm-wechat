import error from 'jm-err'
import log from 'jm-log4js'
import MS from 'jm-ms-core'

let ms = new MS()
let Err = error.Err
let logger = log.getLogger('jm-wechat')

export default function (service, opts = {}) {
  let t = function (doc, lng) {
    if (doc && lng && doc.err && doc.msg) {
      return {
        err: doc.err,
        msg: service.t(doc.msg, lng) || Err.t(doc.msg, lng) || doc.msg
      }
    }
    return doc
  }

  let auth = function (opts, cb) {
    let oauth = service.oauth
    oauth.getAccessToken(opts.params.code, function (err, result) {
      if (err) {
        logger.error(err.stack)
        cb(err, Err.FA_SYS)
      }
      cb(null, {
        openid: result.data.openid,
        unionid: result.data.unionid
      })
    })
  }

  let router = ms.router()
  router
    .add('/:code', 'get', auth)
  return router
}
