'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (service) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var t = function t(doc, lng) {
    if (doc && lng && doc.err && doc.msg) {
      return {
        err: doc.err,
        msg: service.t(doc.msg, lng) || Err.t(doc.msg, lng) || doc.msg
      };
    }
    return doc;
  };

  var auth = function auth(opts, cb) {
    var oauth = service.oauth;
    oauth.getAccessToken(opts.params.code, function (err, result) {
      if (err) {
        logger.error(err.stack);
        cb(err, Err.FA_SYS);
      }
      cb(null, {
        openid: result.data.openid,
        unionid: result.data.unionid
      });
    });
  };

  var router = ms.router();
  router.add('/:code', 'get', auth);
  return router;
};

var _jmErr = require('jm-err');

var _jmErr2 = _interopRequireDefault(_jmErr);

var _jmLog4js = require('jm-log4js');

var _jmLog4js2 = _interopRequireDefault(_jmLog4js);

var _jmMsCore = require('jm-ms-core');

var _jmMsCore2 = _interopRequireDefault(_jmMsCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ms = new _jmMsCore2.default();
var Err = _jmErr2.default.Err;
var logger = _jmLog4js2.default.getLogger('jm-wechat');

module.exports = exports['default'];