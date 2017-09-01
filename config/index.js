require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
var config = {
  development: {
    port: 3000,
    lng: 'zh_CN',
    appid: 'wx55cf9ab2b9ad8207',
    appsecret: '49c46bc2984c6eec8d3489bf84080d61',
    modules: {
      wechat: {
        module: process.cwd() + '/lib'
      }
    }
  },
  production: {
    port: 3000,
    lng: 'zh_CN',
    modules: {
      'wechat': {
        module: process.cwd() + '/lib'
      }
    }
  }
}

var env = process.env.NODE_ENV || 'development'
config = config[env] || config['development']
config.env = env

module.exports = config
