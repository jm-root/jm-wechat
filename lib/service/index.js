const Promise = require('bluebird')
const _redis = require('redis')
const event = require('jm-event')
const consts = require('../consts')
const log = require('jm-log4js')
const Api = require('co-wechat-api')
const OAuth = require('co-wechat-oauth')

let logger = log.getLogger('wechat')
Promise.promisifyAll(_redis.RedisClient.prototype)
Promise.promisifyAll(_redis.Multi.prototype)

class Wechat {
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
    this.ready = false
    this.tokenKey = opts.token_key || consts.TokenKey

    let redis = null
    if (opts.redis) {
      redis = _redis.createClient(opts.redis)
    } else {
      redis = _redis.createClient()
    }
    redis.on('ready', () => {
      this.ready = true
      this.emit('ready')
    })
    redis.on('end', () => {
      this.ready = false
      this.emit('notready')
    })
    this.redis = redis

    this.config = opts

    let getKey = id => {
      return this.tokenKey + ':' + id
    }

    const appid = opts.appid
    const appsecret = opts.appsecret

    this.api = new Api(
      appid,
      appsecret,
      async function () {
        let doc = await redis.getAsync(getKey(`api:${appid}`))
        logger.debug(`get api token: ${doc}`)
        return JSON.parse(doc)
      }, async function (opts) {
        await redis.setAsync(getKey(`api:${appid}`), JSON.stringify(opts))
        logger.debug(`save api token: ${JSON.stringify(opts)}`)
      }
    )
    this.oauth = new OAuth(
      appid,
      appsecret,
      async function (openid) {
        let doc = await redis.getAsync(getKey(openid))
        logger.debug(`get oauth token: ${doc} openid: ${openid}`)
        return JSON.parse(doc)
      },
      async function (openid, opts) {
        await redis.setAsync(getKey(openid), JSON.stringify(opts))
        logger.debug(`save oauth token: ${JSON.stringify(opts)} openid: ${openid}`)
      }
    )
  }

  async onReady () {
    if (this.ready) return
    return new Promise(resolve => {
      this.once('ready', () => {
        this.ready = true
        resolve()
      })
    })
  }
}

module.exports = Wechat
