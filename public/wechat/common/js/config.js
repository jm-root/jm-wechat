var apiuri = 'http://api.mx.jamma.cn'
var domain = 'jamma.cn'

var host = document.domain
if (host.indexOf(domain) >= 0) {
  document.domain = domain
}
