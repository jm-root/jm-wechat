const MS = require('jm-ms-core')
let ms = new MS()

module.exports = function (service, opts = {}) {
  let authuri = async opts => {
    let oauth = service.oauth
    let uri = opts.data.uri || opts.data.url
    let web = opts.data.web || false
    let state = opts.data.state || ''
    let scope = opts.data.scope || 'snsapi_userinfo'
    web && (scope = 'snsapi_login')
    let doc = null
    if (web) { doc = await oauth.getAuthorizeURLForWebsite(uri, state, scope) } else { doc = await oauth.getAuthorizeURL(uri, state, scope) }
    return {
      uri: doc
    }
  }

  let auth = async opts => {
    let oauth = service.oauth
    let doc = await oauth.getAccessToken(opts.params.code)
    return {
      openid: doc.data.openid,
      unionid: doc.data.unionid
    }
  }

  let getUserByCode = async opts => {
    let oauth = service.oauth
    let doc = await oauth.getUserByCode(opts.params.code)
    return doc
  }

  let wrap = service.wrapRoute
  let router = ms.router()
  router
    .add('/uri', 'get', wrap(authuri))
    .add('/:code', 'get', wrap(auth))
    .add('/:code/user', 'get', wrap(getUserByCode))
  return router
}
