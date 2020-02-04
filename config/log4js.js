module.exports = {
  appenders: {
    console: { type: 'console' },
    wechat: {
      type: 'dateFile',
      filename: 'logs/wechat',
      pattern: 'yyyyMMdd.log',
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: { appenders: [ 'console' ], level: 'info' },
    wechat: { appenders: [ 'console', 'wechat' ], level: 'info' }
  }
}
