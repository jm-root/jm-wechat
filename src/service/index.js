import OAuth from 'wechat-oauth'
import router from '../router'

/**
 * wechat service
 * @param {Object} opts
 * @example
 * opts参数:{
 *  appid: appid
 *  appsecret: appsecret
 * }
 * @return {Object} service
 */
export default function (opts = {}) {
  let o = {
    ready: true,
    config: opts,
    oauth: new OAuth(opts.appid, opts.appsecret)
  }
  o.router = router

  return o
};
