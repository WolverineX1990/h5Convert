var fetch = require('node-fetch');

module.exports = function() {
  var body = '{"appExtId":"","name":"我的兔展作品","desc":"我用兔展做了一个超炫酷的H5,快来看看吧！","shortUrl":"","appUrl":"","previewUrl":"","domainUrl":"","templateId":"","type":"2","level":"0","state":"1","width":320,"height":504,"dialogs":[],"fonts":[],"isMaterial":false,"materials":[],"isVideo":false,"createtime":"","updatetime":"","statetime":"","deeplink":"","deepshare":"","ext":"","imgId":"","imgKey":"","imgBucket":"","imgServer":"","imgPath":"//file.rabbitpre.com/default.png","logoId":"","logoKey":"","logoBucket":"","logoServer":"","logoPath":"//file.rabbitpre.com/logo.png","coverImg":"","tags":"","pfid":"","timeInterval":0,"gather":"","switchGuide":true,"in":"","out":"","company":"","link":"","showReport":true,"showViewCount":true,"loop":false,"publish":false,"brandType":"3","animationApplyAll":1,"showWeChatHead":0,"isAdvertising":false,"pages":[{"id":"page_1","pageExtId":"","appId":"","width":320,"height":504,"createtime":"","updatetime":"","row":0,"col":0,"bgColor":"#fff","bgImage":"","bgImageType":0,"bgServer":"","bgLeft":0,"bgTop":0,"in":"","out":"","opacity":1,"formatVersion":"2.0","crop":{},"cmps":[]}]}';
  var Cookie = 'gr_user_id=f562eaf0-dfea-466d-badf-150d49b02347; _ga=GA1.2.89191340.1529632250; SSOToken=eyJjdHkiOiJqd3QiLCJhbGciOiJIUzI1NiJ9.NEY5QkZBMkJCOUQxMDAzRUM1NDk0OUVCOUVDOUU2QTNFMzQzMzYyNjNBQUM0RERFNjlDQjc0QzNGODFCMkUyODg0MjVCN0I0MDVBOEI0RUE1MThCRjUyMzEyNUZCN0MwNDg3OEIxRkE3RDcxRDA1NzZENDA1NUFBN0QzRjk5MDA3QTdGMERCNkQwMjYyODE0NjE0MzQzNjE1NTUyN0FCNEU0Q0ZBQkZEOEU2OUY5RDJDODUyRDBENjc4NDBCQkRFNTZCNDdGMTM1QTkxMDIxQw.ttq4Dx_t7S4PTduPtQ-4942tpxA3ScMtCdsZoW_YhjU; Hm_lvt_9ad3eedcbfcad678357018dda8c8c602=1529228046,1529290626,1529629851,1529731850; Hm_lvt_de7d8515aad4ac1c242b76b728589f5d=1529228046,1529290631,1529630501,1529732374; Hm_lpvt_de7d8515aad4ac1c242b76b728589f5d=1529733246; Hm_lpvt_9ad3eedcbfcad678357018dda8c8c602=1529769486; connect.sid=s%3A7BihQUjFuIQEgioD4-sq2Kfbu7HLXjEg.K9wtcLxUTzKl8ZS6H5YuYo2xn2n1gxUIi4vtw03Aebs';
  fetch('http://editor.rabbitpre.com/api/app', { 
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': Cookie
    },
  })
  .then(res => res.json())
  .then(json => {
    var obj = {"id":json.data.id,"appExtId":json.data.appExtId,"name":"2018世界杯 酒吧 派对 活动","desc":"我用兔展做了一个超炫酷的H5,快来看看吧！","shortUrl":"aUe1Zic9qQ","appUrl":"http://renderer.rabbitpre.com/m2/aUe1Zic9qQ?mobile=1","previewUrl":"http://renderer.rabbitpre.com/m2/aUe1Zic9qQ?mobile=1&preview=1","domainUrl":"","templateId":"","type":"1","level":"0","state":"4","width":320,"height":504,"dialogs":[],"fonts":[],"isMaterial":false,"materials":[],"isVideo":false,"createtime":"2018-06-23 13:52:18","updatetime":"2018-06-23 13:52:34","statetime":"2018-06-23 13:52:34","deeplink":"","deepshare":"","ext":"","imgId":"","imgKey":"","imgBucket":"","imgServer":"","imgPath":"//file.rabbitpre.com/default.png","logoId":"","logoKey":"","logoBucket":"","logoServer":"","logoPath":"//file.rabbitpre.com/logo.png","coverImg":"","tags":"","userId":"19d9e8bf-60f0-41f7-8865-9c6846c8da27","pfid":"","timeInterval":0,"gather":"","switchGuide":true,"in":"cvbe","out":"","company":"","link":"","showReport":true,"showViewCount":true,"loop":false,"publish":false,"brandType":"3","animationApplyAll":1,"showWeChatHead":0,"isAdvertising":false,"pages":[{"id":"","pageExtId":"","appId":json.data.appId,"width":320,"height":504,"createtime":"","updatetime":"","row":0,"col":0,"bgColor":"#fff","bgImage":"","bgImageType":0,"bgServer":"","bgLeft":0,"bgTop":0,"in":"","out":"","opacity":1,"formatVersion":"2.0","crop":{},"cmps":[{"id":"15297333444362","name":"001文本","type":"text","style":{"rotate":0,"opacity":1,"borderStyle":"solid","borderWidth":0,"borderColor":"#000","width":110,"height":"auto","left":37,"color":"#333","fontSize":16,"fontFamily":"normal","fontStyle":"normal","fontWeight":"normal","textAlign":"left","textDecoration":"none","lineHeight":16,"letterSpacing":0,"borderRadius":0,"backgroundColor":"transparent","top":131},"animations":[{"isActive":true,"name":"从上淡入","animate":"fadeInDown","duration":1,"delay":0,"count":1,"interval":0,"isCompose":false,"order":"normal"}],"triggers":[],"readonly":false,"readonlySetter":"","isFixed":false,"interaction":false,"visible":true,"isLocked":false,"gid":"","text":"<div>双击输入文字</div><div style=\"font-size:12px\">(可逐字设置样式)</div>","innerText":"双击输入文字","isRichText":true,"materials":[]},{"id":"15297343292413","name":"002图片","type":"image","style":{"rotate":0,"opacity":1,"borderStyle":"solid","borderWidth":0,"borderColor":"#000","width":172,"height":172,"shadowX":0,"shadowY":0,"shadowColor":"transparent","borderRadius":0,"left":74,"top":166},"animations":[{"isActive":true,"name":"从上淡入","animate":"fadeInDown","duration":1,"delay":0,"count":1,"interval":0,"isCompose":false,"order":"normal"}],"triggers":[],"readonly":false,"readonlySetter":"","isFixed":false,"interaction":false,"visible":true,"isLocked":false,"gid":"","src":"//ali2.rabbitpre.com/bbd8d520-343a-416b-a191-7830d2993c58.jpg","filter":"","crop":{"width":172,"height":172,"left":0,"top":0,"right":0,"bottom":0},"fullSize":{"width":172,"height":172},"display":{"width":172,"height":172,"left":0,"top":0,"right":0,"bottom":0},"ori":{"width":344,"height":344}}]},{"id":"","pageExtId":"","appId":json.data.appId,"width":320,"height":504,"createtime":"","updatetime":"","row":1,"col":0,"bgColor":"#fff","bgImage":"","bgImageType":0,"bgServer":"","bgLeft":0,"bgTop":0,"in":"","out":"","opacity":1,"formatVersion":"2.0","crop":{},"cmps":[{"id":"15297333349881","name":"001文本","type":"text","style":{"rotate":0,"opacity":1,"borderStyle":"solid","borderWidth":0,"borderColor":"#000","width":110,"height":"auto","left":105,"color":"#333","fontSize":16,"fontFamily":"normal","fontStyle":"normal","fontWeight":"normal","textAlign":"left","textDecoration":"none","lineHeight":16,"letterSpacing":0,"borderRadius":0,"backgroundColor":"transparent","top":252},"animations":[],"triggers":[],"readonly":false,"readonlySetter":"","isFixed":false,"interaction":false,"visible":true,"isLocked":false,"gid":"","text":"双击输入文字","innerText":"双击输入文字","isRichText":false,"materials":[]}]}]};
    return fetch('http://editor.rabbitpre.com/api/app/' + json.id, { 
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': Cookie
      },
    })
  })
  .then(res=>res.json())
  .then(res=>console.log(res));
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