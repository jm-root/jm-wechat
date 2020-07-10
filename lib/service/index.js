const Redis = require('ioredis')
const event = require('jm-event')
const consts = require('../consts')
const log = require('jm-log4js')
const Api = require('co-wechat-api')
const OAuth = require('co-wechat-oauth')

let logger = log.getLogger('wechat')

module.exports = class {
  /**
   * wechat service
   * @param {Object} opts
   * @example
   * opts参数:{
   *  redis: redis
   *  appid: appid
   *  appsecret: appsecret
   * }
   * @return {Object} service
   */
  constructor (opts = {}) {
    event.enableEvent(this)
    this.tokenKey = opts.token_key || consts.TokenKey

    const redis = new Redis(opts.redis || {})

    this.redis = redis
    this.ready = true

    this.config = opts

    const getKey = id => {
      return this.tokenKey + ':' + id
    }

    const appid = opts.appid
    const appsecret = opts.appsecret

    this.api = new Api(
      appid,
      appsecret,
      async function () {
        let doc = await redis.get(getKey(`api:${appid}`))
        logger.debug(`get api token: ${doc}`)
        return JSON.parse(doc)
      }, async function (opts) {
        await redis.set(getKey(`api:${appid}`), JSON.stringify(opts))
        logger.debug(`save api token: ${JSON.stringify(opts)}`)
      }
    )
    this.oauth = new OAuth(
      appid,
      appsecret,
      async function (openid) {
        let doc = await redis.get(getKey(openid))
        logger.debug(`get oauth token: ${doc} openid: ${openid}`)
        return JSON.parse(doc)
      },
      async function (openid, opts) {
        await redis.set(getKey(openid), JSON.stringify(opts))
        logger.debug(`save oauth token: ${JSON.stringify(opts)} openid: ${openid}`)
      }
    )
  }

  async onReady () {
    return this.ready
  }
}
