const Promise = require('bluebird')
const _redis = require('redis')
const event = require('jm-event')
const consts = require('../consts')
const log = require('jm-log4js')
const error = require('jm-err')
const Api = require('co-wechat-api')
const OAuth = require('co-wechat-oauth')

let Err = consts.Err
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
    this.tokenKey = opts.tokenKey || consts.TokenKey

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

    this.api = new Api(
      opts.appid,
      opts.appsecret,
      async function () {
        let doc = await redis.getAsync(getKey('api'))
        logger.debug(`get api token: ${doc}`)
        return JSON.parse(doc)
      }, async function (opts) {
        await redis.setAsync(getKey('api'), JSON.stringify(opts))
        logger.debug(`save api token: ${opts}`)
      }
    )
    this.oauth = new OAuth(
      opts.appid,
      opts.appsecret,
      async function (openid) {
        let doc = await redis.getAsync(getKey(openid))
        logger.debug(`get oauth token: ${doc} openid: ${openid}`)
        return JSON.parse(doc)
      },
      async function (openid, opts) {
        await redis.setAsync(getKey(openid), JSON.stringify(opts))
        logger.debug(`save oauth token: ${opts} openid: ${openid}`)
      }
    )
  }

  onReady () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (self.ready) return resolve(self.ready)
      self.once('ready', function () {
        resolve(self.ready)
      })
    })
  }
}

module.exports = Wechat
