require('log4js').configure(require('path').join(__dirname, 'log4js.json'))
var config = {
  development: {
    port: 3000,
    lng: 'zh_CN',
    appid: 'wx013e73ea52c76c26',
    appsecret: '3a1cc331c12bf4afebeb3701b8035896',
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
