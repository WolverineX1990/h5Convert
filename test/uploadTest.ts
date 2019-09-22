let FormData = require('form-data');
let http = require('http');
import fetch from 'node-fetch';
import { parse as urlParse } from 'url';
import RabbitUser from './../core/user/RabbitUser';
import CONFIG from './../core/const/CONFIG';
import { getUploadToken1 } from './../core/api/service';
import { getResource } from './../core/utils/index';
var needle = require('needle');

let imgpath = 'http://res1.eqh5.com/group1/M00/B1/A3/yq0KXFZysi-ACYaKAAACDQH4Nes625.svg';

function upload() {
  let user = new RabbitUser(CONFIG.userName, CONFIG.userPwd);
  user.login()
    .then(() => {
      let header = { 
        Origin: CONFIG.origin, 
        Cookie: user.cookie.join('; '),
        'Content-Type': 'application/json'
      };
      let file;
      return getResource(imgpath).then(res => {
        file = Buffer.from(res, 'binary');
        return getUploadToken1('IMAGE', false, header, '[{"type":"image/svg xml","size":'+file.length+'}]');
      }).then(res=> {
          console.log(res)
          let token = res.data[0];
          let data: any = {
            'x-cos-security-token': token.token,
            'Signature': token.signature,
            'key': token.key,
            'Content-Type': 'image/svg xml',
            'Content-Length': file.length
          };

          data.file = {
            buffer: file,
            fileName: 'a.png',
            content_type: 'image/png'
          }

          up1(token.url, data);
          console.log(token.path);        
      });
    })
}


function up1 (url, data) {
  needle.post(url, data, {multipart: true}, function(err, resp, body) {
    console.log(resp.statusCode);
    console.log(body.toString());
  });
}

function up(url, data) {
  let reg = /^http/;
  if (!reg.test(url)) {
    url = `https:${url}`;
  }
  let form = new FormData();
  Object.keys(data).forEach(key => {
      if (key == 'file') {
        form.append(key, data[key], {contentType: 'image/png', filename: 'a.png'});
      } else {
        form.append(key, data[key]);
      }
  });
  let param = urlParse(url);
  var headers = form.getHeaders();//这个不能少
  console.log(headers)
  var request = http.request({
    method: 'post',
    host: param.host,
    path: '/',
    headers: headers
  },function(res:any){
    var str='';
    res.on('data',function(buffer:any){
      str+=buffer;//用字符串拼接
    }
    );
    res.on('end',()=>{
      // var result = JSON.parse(str);
      console.log(str)
      //上传之后result就是返回的结果
    });
  });
  form.pipe(request);

  // console.log(data);

  // fetch(url, { method: 'POST', body: form, header: {
  //   'Content-Type': 'multipart/form-data; boundary=---------------------------1260629600328025898540745837'
  // }})
  //   // .then(res => res.json())
  //   .then(json => {
  //     console.log(json)
  //   });
}

export default upload;