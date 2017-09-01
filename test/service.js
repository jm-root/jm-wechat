import chai from 'chai'

let expect = chai.expect
import config from '../config'
import $ from '../src'

let service = $(config)
let router = service.router()

let wechat = {
  account: 'jeff',
  password: '123',
  mobile: '13600000000',
  email: 'jeff@jamma.cn',
  nick: 'jeff'
}

let log = (err, doc) => {
  err && console.error(err.stack)
}

let init = function () {
  return new Promise(function (resolve, reject) {
    service.onReady().then(() => {
      resolve(service.wechat.findOneAndRemove({account: wechat.account}))
    })
  })
}

describe('service', function () {
  it('create wechat', function (done) {
    init().then(function () {
      service.wechat.create(wechat, function (err, doc) {
        log(err, doc)
        expect(err === null).to.be.ok
        service.wechat.create(wechat, function (err, doc) {
          log(err, doc)
          expect(err !== null).to.be.ok
          done()
        })
      })
    })
  })
})
