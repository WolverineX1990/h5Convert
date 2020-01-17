let FormData = require('form-data');
let http = require('http');
import fetch from 'node-fetch';
import { parse as urlParse } from 'url';
import RabbitUser from './../core/user/RabbitUser';
import CONFIG from './../core/const/CONFIG';
import { getUploadToken1 } from './../core/api/service';
import { getResource } from './../core/utils/index';
var needle = require('needle');

let imgpath = 'http://h5.eqxiu.com/s/iFlxHjA1'//'http://res.eqh5.com/o_1dce6ogva6s1925q1d1mgvifu9.mp3';

function upload() {

  getResource(imgpath).then(res => {
    console.log(res)
    
  })
  return
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
        console.log(res)
        file = Buffer.from(res, 'binary');
        return getUploadToken1('MUSIC', false, header, '[{"type":"audio/mp3","size":'+file.length+'}]');
      }).then(res=> {
          console.log(res)
          let token = res.data[0];
          let data: any = {
            'x-cos-security-token': token.token,
            'Signature': token.signature,
            'key': token.key,
            'Content-Type': 'audio/mp3',
            'Content-Length': file.length
          };

          data.file = {
            buffer: file,
            fileName: 'a.mp3',
            content_type: 'audio/mp3'
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
        form.append(key, data[key], {contentType: 'audio/mp3', filename: 'a.mp3'});
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