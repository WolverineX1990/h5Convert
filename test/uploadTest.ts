let FormData = require('form-data');
let http = require('http');
import fetch from 'node-fetch';
import RabbitUser from './../core/user/RabbitUser';
import CONFIG from './../core/const/CONFIG';
import { getUploadToken } from './../core/api/service';
import { getResource } from './../core/utils/index';


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
      return getUploadToken('IMAGE', true, header, '[{"type":"image/png","size":140024}]')
              .then(res=> {
                let token = res.data[0];
                  return getResource(imgpath).then(res => {
                    let data = {
                      'OSSAccessKeyId': token.accessKey,
                      'policy': token.policy,
                      'signature': token.signature,
                      'key': token.key,
                      'Content-Type': 'image/png',
                      'x-oss-meta-type': token.xparams.type,
                      'x-oss-meta-keyprev': token.xparams.keyprev,
                      'x-oss-meta-userid': token.xparams.userid,
                      'x-oss-meta-userfolder': token.xparams.userfolder,
                      'x-oss-meta-bucket': token.xparams.bucket,
                      'x-oss-meta-server': token.xparams.server
                    };
  
                    data['file'] = Buffer.from(res, 'binary');
                    up(token.url, data);
                    console.log(token.path);
                  // });
                });
              });
    })
}


function up(url, data) {
  let reg = /^http/;
  if (!reg.test(url)) {
    url = `https:${url}`;
  }
  let form = new FormData();
  Object.keys(data).forEach(key => {
      form.append(key, data[key]);
  });

  // console.log(data);

  fetch(url, { method: 'POST', body: form })
    // .then(res => res.json())
    .then(json => {
      // console.log(json)
    });
}

export default upload;