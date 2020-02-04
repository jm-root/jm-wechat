const $ = require('./service')

let router = null
beforeAll(async () => {
  await $.onReady()
  router = $.router()
})

test('uri', async () => {
  let doc = await router.get('/oauth/uri', { uri: 'http://www.baidu.com' })
  console.log(doc)
  expect(doc.uri).toBeTruthy()
})

test('uri for web', async () => {
  let doc = await router.get('/oauth/uri', { uri: 'http://www.baidu.com', web: 1 })
  console.log(doc)
  expect(doc.uri).toBeTruthy()
})
