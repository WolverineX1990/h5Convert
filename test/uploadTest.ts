let FormData = require('form-data');
let http = require('http');
import fetch from 'node-fetch';
import { parse as urlParse } from 'url';
import RabbitUser from './../core/user/RabbitUser';
import CONFIG from './../core/const/CONFIG';
import { getUploadToken1 } from './../core/api/service';
import { getResource } from './../core/utils/index';
var needle = require('needle');

let imgpath = 'http://res.eqh5.com/o_1cj8ao2521h8t1f0o837j3sae614.png';

function upload() {
  let user = new RabbitUser(CONFIG.userName, CONFIG.userPwd);
  user.login()
    .then(() => {
      let header = { 
        Origin: CONFIG.origin, 
        Cookie: user.cookie.join('; '),
        'Content-Type': 'application/json'
      };
      return getUploadToken1('IMAGE', true, header, '[{"type":"image/png","size":24756}]')
              .then(res=> {
                let token = res.data[0];
                // console.log(res)
                  return getResource(imgpath).then(res => {
                    let file = Buffer.from(res, 'binary');

                    // data.file = {
                    //   buffer: new Buffer(res, 'binary'),
                    //     filename: fileName,
                    //     content_type: contentType
                    // };
                    let data: any = {
                      'x-cos-security-token': token.token,
                      'Signature': token.signature,
                      'key': token.key,
                      'Content-Type': 'image/png',
                      'Content-Length': file.length
                      // 'x-oss-meta-type': token.xparams.type,
                      // 'x-oss-meta-keyprev': token.xparams.keyprev,
                      // 'x-oss-meta-userid': token.xparams.userid,
                      // 'x-oss-meta-userfolder': token.xparams.userfolder,
                      // 'x-oss-meta-bucket': token.xparams.bucket,
                      // 'x-oss-meta-server': token.xparams.server
                    };

                    console.log(data)

                    data.file = {
                      buffer: file,
                      fileName: 'a.png',
                      content_type: 'image/png'
                    }
  
                    up1(token.url, data);
                    console.log(token.path);
                  // });
                });
              });
    })
}


function up1 (url, data) {
  needle.post(url, data, {multipart: true}, function(err, resp, body) {
    console.log(resp.statusCode);
    console.log(body.toString());
  });
}

// q-sign-algorithm=sha1&q-ak=AKID8q9oQIVys2ojRDB19DOAL3ty5Qcwj4bl&q-sign-time=1569142107;1569143007&q-key-time=1569142107;1569143007&q-header-list=content-length;content-type&q-url-param-list=&q-signature=9c61448cdf2c7cf445888cd83c678997c28497e5
// q-sign-algorithm=sha1&q-ak=AKID8q9oQIVys2ojRDB19DOAL3ty5Qcwj4bl&q-sign-time=1569142107;1569143007&q-key-time=1569142107;1569143007&q-header-list=content-length;content-type&q-url-param-list=&q-signature=9c61448cdf2c7cf445888cd83c678997c28497e5

// q-sign-algorithm=sha1&q-ak=AKIDKSTXd8I6HrXt35DYNLSPtwutj3jkAVl4&q-sign-time=1569156594;1569157494&q-key-time=1569156594;1569157494&q-header-list=content-length;content-type&q-url-param-list=&q-signature=908a68c0b95e464c2b53e775ee55f9ecbd7610b8
function up(url, data) {
  // console.log(data)
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