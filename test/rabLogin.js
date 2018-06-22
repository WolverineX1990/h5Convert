var fetch = require('node-fetch');

module.exports = function() {
  var body = '{"appExtId":"","name":"我的兔展作品","desc":"我用兔展做了一个超炫酷的H5,快来看看吧！","shortUrl":"","appUrl":"","previewUrl":"","domainUrl":"","templateId":"","type":"2","level":"0","state":"1","width":320,"height":504,"dialogs":[],"fonts":[],"isMaterial":false,"materials":[],"isVideo":false,"createtime":"","updatetime":"","statetime":"","deeplink":"","deepshare":"","ext":"","imgId":"","imgKey":"","imgBucket":"","imgServer":"","imgPath":"//file.rabbitpre.com/default.png","logoId":"","logoKey":"","logoBucket":"","logoServer":"","logoPath":"//file.rabbitpre.com/logo.png","coverImg":"","tags":"","pfid":"","timeInterval":0,"gather":"","switchGuide":true,"in":"","out":"","company":"","link":"","showReport":true,"showViewCount":true,"loop":false,"publish":false,"brandType":"3","animationApplyAll":1,"showWeChatHead":0,"isAdvertising":false,"pages":[{"id":"page_1","pageExtId":"","appId":"","width":320,"height":504,"createtime":"","updatetime":"","row":0,"col":0,"bgColor":"#fff","bgImage":"","bgImageType":0,"bgServer":"","bgLeft":0,"bgTop":0,"in":"","out":"","opacity":1,"formatVersion":"2.0","crop":{},"cmps":[]}]}';
  var Cookie = 'connect.sid=s%3AtahrjrE5Wm2kSfP5g7t69ZHL_XUoIDLT.p6Mc4DaZwsX9nM43biqcwetvyVjPoy66hOpH4Cb3zjY; SSOToken=eyJjdHkiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.NEY5QkZBMkJCOUQxMDAzRUM1NDk0OUVCOUVDOUU2QTNFMzQzMzYyNjNBQUM0RERFNjlDQjc0QzNGODFCMkUyODg0MjVCN0I0MDVBOEI0RUE1MThCRjUyMzEyNUZCN0MwNDg3OEIxRkE3RDcxRDA1NzZENDA1NUFBN0QzRjk5MDA3QTdGMERCNkQwMjYyODE0NjE0MzQzNjE1NTUyN0FCNEU0Q0ZBQkZEOEU2OUY5RDJDODUyRDBENjc4NDBCQkRFNTZCNDdGMTM1QTkxMDIxQw.ttq4Dx_t7S4PTduPtQ-4942tpxA3ScMtCdsZoW_YhjU';
  fetch('http://editor.rabbitpre.com/api/app', { 
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': Cookie
    },
  })
  .then(res => res.json())
  .then(json => console.log(json))
  // const body = {
  //   account: '18519203764',
  //   password: '19900325x'
  // };
  // fetch('https://passport.rabbitpre.com/api/sso/login', { 
  //   method: 'POST',
  //   body: JSON.stringify(body),
  //   headers: { 'Content-Type': 'application/json' },
  // })
  // .then(res => res.json())
  // .then(json => console.log(json))
}