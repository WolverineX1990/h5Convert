// import { post as needlePost } from 'needle';
import needlePost from './../utils/needle.ext';
import RabbitUser from './../user/RabbitUser';
import { createRabAlbum, getUploadToken, uploadMusic, upload, publishTpl,saveRabAlbum } from './../api/service';
import RABPAGE from './../const/RABPAGE';
import CONFIG from './../const/CONFIG';
import { getResource } from './../utils/index';

enum FileType {
  Music= 'MUSIC',
  Image= 'IMAGE',
  Svg= 'FILE'
};

/**
 * @description 兔展场景对象
 * @author wolverinex
 * @class Rabbit
 */
export default class Rabbit {
  private _user: RabbitUser;
  private _httpHeader: Object;
  data: Object;
  
  set user(user) {
    this._user = user;
    this._httpHeader = {
      Origin: CONFIG.origin, 
      Cookie: user.cookie.join('; '),
      'Content-Type': 'application/json'
    };
  }
  
  setGather(id, text) {
    if(!this.data['gather']) {
      this.data['gather'] = {id: 0, strict: {}};
    }

    let strict = this.data['gather'].strict;
    strict[id] = text;
  }
  
  createAlbum() {
    return createRabAlbum(RABPAGE, this._httpHeader)
            .then(res => {
              if (!res.success) {
                throw new Error(res.errormsg);
              }
              this.data = res.data;
              return this;
            });
  }

  save() {
    return saveRabAlbum(this.data, this._httpHeader);
  }

  publish() {
		return publishTpl(this.data, this._httpHeader);
	}

  setBgAudio(audioPath: string) {
    if(!audioPath) {
      return Promise.resolve();
    }
    return getUploadToken(FileType.Music, true, this._httpHeader)
            .then(res => uploadRes(res.data[0], audioPath, FileType.Music))
            .then(token => {
              return uploadMusic(getUpParam(token), this._httpHeader).then(json=>{
                this.data['bgmusic'] = {
                  musicBucket: token.xparams.bucket,
                  musicKey: token.key,
                  musicName: 'filename',
                  musicServer: token.xparams.server,
                  musickId: json.data.id,
                  src: json.data.path
                };
                return this;
              });
            });
  }

  setCover(imgPath: string) {
    return getUploadToken(FileType.Svg, false, this._httpHeader)
            .then(res => uploadRes(res.data[0], imgPath, FileType.Image))
            .then(token => {
              return upload(getUpParam(token), this._httpHeader).then(json=>{
                var data = json.data;
                this.data['imgKey'] = token.key;
			          this.data['imgServer'] = token.xparams.server;
                this.data['imgId'] = data.id;
                this.data['imgBucket'] = token.xparams.bucket;
                this.data['imgPath'] = data.path;
                return this;
              });
            });
  }

  uploadImg(filePath: string) {
    return getUploadToken(FileType.Image, true, this._httpHeader)
              .then(res => uploadRes(res.data[0], filePath, FileType.Image))
  }

  uploadSvg(filePath: string) {
    return getUploadToken(FileType.Svg, false, this._httpHeader)
              .then(res => uploadRes(res.data[0], filePath, FileType.Svg))
  }
}

function getUpParam(token) {
  let data = {
    file: {
      bucket: token.xparams.bucket,
      key: token.key,
      keyprev: token.xparams.keyprev,
      name: token.key.replace('mp3/', ''),
      path: token.path,
      server: token.xparams.server,
      size: 100,
      type: token.xparams.type,
      userfolder: token.xparams.userfolder,
      userid: token.userid
    }
  };

  return data;
}

function getFileParam(type) {
  let fileName, contentType
  if (type == FileType.Music) {
    fileName = 'upload.mp3';
    contentType = 'audio/mp3';
  } else if(type == FileType.Image) {
    fileName = 'upload.png';
    contentType = 'image/png';
  } else if(type == FileType.Svg) {
    fileName = 'upload.svg';
    contentType = 'application/octet-stream';
  }

  if(!fileName) {
    throw new Error('Class:Rabbit->method:getFileParam no type')
  }

  return {
    fileName,
    contentType
  }
}

function uploadRes(token, url, type) {
  let promise = new Promise((resolve, reject) => {
    getResource(url).then(res => {
      let param = getFileParam(type);
      var data = {
        'OSSAccessKeyId': token.accessKey,
        'policy': token.policy,
        'signature': token.signature,
        'key': token.key,
        'Content-Type': param.contentType,
        'x-oss-meta-type': token.xparams.type,
        'x-oss-meta-keyprev': token.xparams.keyprev,
        'x-oss-meta-userid': token.xparams.userid,
        'x-oss-meta-userfolder': token.xparams.userfolder,
        'x-oss-meta-bucket': token.xparams.bucket,
        'x-oss-meta-server': token.xparams.server
      };

      data['file'] = {
        buffer: new Buffer(res, 'binary'),
        filename: param.fileName,
        content_type: param.contentType
      };
      let reg = /^http/;
      if (!reg.test(token.url)) {
        token.url = `http:${token.url}`;
      }
      needlePost(token.url, data)
            .then(()=> {
              resolve(token); 
            }, () => {
              console.log(param.fileName+'###'+token.url+'###'+url);
              throw new Error('upload');
            })
      // needlePost(token.url, data, {multipart: true}, function(err, resp, body) {
      //   if (err) {
      //     console.log(param.fileName+'###'+token.url+'###'+url);
      //     // console.log(res);
      //     throw new Error(JSON.stringify(err));
      //   } else {
      //     resolve(token);
      //   }
      // });
    });
  });
  return promise;
}