'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var o = {
    ready: true,
    config: opts,
    oauth: new _wechatOauth2.default(opts.appid, opts.appsecret)
  };
  o.router = _router2.default;

  return o;
};

var _wechatOauth = require('wechat-oauth');

var _wechatOauth2 = _interopRequireDefault(_wechatOauth);

var _router = require('../router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;

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
module.exports = exports['default'];