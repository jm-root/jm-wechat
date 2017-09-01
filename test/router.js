import chai from 'chai'

let expect = chai.expect
import config from '../config'
import $ from '../src'

let service = $(config)
let router = service.router()

service.config.ways = ['wechat']
let payInfo = {
  userId: '59648c53e366560a94e80bce',
  way: 'wechat',
  title: '测试',
  content: '测试付款',
  currency: 'cny',
  amount: 1,
  orderId: '123',
  memo: '测试哟个',
  ext: {
    userId: '5996f970adec8b0df8bcd231'
  }
}

let log = (err, doc) => {
  err && console.error(err.stack)
}

let init = function () {
  return new Promise(function (resolve, reject) {
    service.onReady().then(() => {
      resolve()
    })
  })
}

describe('router', function () {
  it('prepay', function (done) {
    init()
      .then(function () {
        router.post('/prepay',
          payInfo,
          function (err, doc) {
            log(err, doc)
            expect(!err && !doc.err).to.be.ok
            done()
          })
      })
  })
})
