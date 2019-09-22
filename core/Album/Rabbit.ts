// import { post as needlePost } from 'needle';
import needlePost from './../utils/needle.ext';
import uploadExt from './../utils/upload';
import RabbitUser from './../user/RabbitUser';
import { createRabAlbum, getUploadToken1, uploadMusic, upload, publishTpl, saveRabAlbum, saveApp } from './../api/service';
import RABPAGE from './../const/RABPAGE';
import CONFIG from './../const/CONFIG';
import { getResource } from './../utils/index';
import { load as LoadHtml } from 'cheerio';
import { parse as urlParse } from 'url';
import { get as httpGet } from 'http';

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

  getCsrfToken () {
    return getHtml(CONFIG.editServerHost, this._httpHeader)
            .then(res => {
              let $ = LoadHtml(res['data']);
              let token = $('meta[name="csrf-token"]');
              let cookies = res['cookie'];
              let cookie = cookies.find(c => c.indexOf('rp.csrf') > -1);
              this._httpHeader['Cookie'] += ';' +cookie; 
              this._httpHeader['X-CSRF-Token'] = token[0].attribs.content;
              return this;
            });
  }

  getCsrfToken1 (id) {
    return getHtml(CONFIG.homeHost + 'marketing/myapp/?appid='+ id, this._httpHeader)
            .then(res => {
              let $ = LoadHtml(res['data']);
              let token = $('meta[name="csrf-token"]');
              let cookies = res['cookie'];
              let cookie = cookies.find(c => c.indexOf('rp.csrf') > -1);
              this._httpHeader['Cookie'] += ';' +cookie; 
              this._httpHeader['X-CSRF-Token'] = token[0].attribs.content;
              return this;
            });
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

  saveApp () {
    return saveApp({
      appId: this.data['id'],
      appName: this.data['name'],
      brandType: 3,
      imgPath: this.data['imgPath'],
      imgurl: this.data['imgurl'],
      desc: this.data['desc'],

    }, this._httpHeader);
  }

  publish() {
		return publishTpl(this.data, this._httpHeader);
	}

  setBgAudio(audioPath: string) {
    if(!audioPath) {
      return Promise.resolve();
    }
    let file;
    return getResource(audioPath).then(res => {
              file = Buffer.from(res, 'binary');
              return getUploadToken1(FileType.Music, true, this._httpHeader, '[{"type":"audio/mp3","size":'+file.length+'}]')
            }).then(res => uploadRes(res.data[0], file, FileType.Music))
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
    let file;
    return getResource(imgPath)
            .then(res => {
              file = Buffer.from(res, 'binary');
              return getUploadToken1(FileType.Svg, false, this._httpHeader, '[{"type":"image/png","size":' + file.length +'}]')
            })
            .then(res => uploadRes(res.data[0], imgPath, FileType.Image))
            .then(token => {
              return upload(getUpParam(token), this._httpHeader).then(json=>{
                var data = json.data;
                // this.data['imgKey'] = token.key;
			          // this.data['imgServer'] = token.xparams.server;
                this.data['imgurl'] = data.id;
                // this.data['imgBucket'] = token.xparams.bucket;
                this.data['imgPath'] = data.path;
                return this;
              });
            });
  }

  uploadImg(filePath: string) {
    let file;
    return getResource(filePath)
              .then(res => {
                file = Buffer.from(res, 'binary');
                return getUploadToken1(FileType.Image, true, this._httpHeader, '[{"type":"image/png","size":' + file.length + '}]')
              })
              .then(res => uploadRes(res.data[0], filePath, FileType.Image))
  }

  uploadSvg(filePath: string) {
    let file;
    return getResource(filePath)
              .then(res => {
                file = Buffer.from(res, 'binary');
                return getUploadToken1(FileType.Image, true, this._httpHeader, '[{"type":"image/png","size":' + file.length + '}]')
              })
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
    return getResource(url).then(res => {
      let param = getFileParam(type);
      let file = Buffer.from(res, 'binary');
      let data: any = {
        'x-cos-security-token': token.token,
        'Signature': token.signature,
        'key': token.key,
        'Content-Type': 'image/png',
        'Content-Length': file.length
      };

      data.file = {
        buffer: file,
        filename: param.fileName,
        content_type: param.contentType
      };
      let reg = /^http/;
      if (!reg.test(token.url)) {
        token.url = `https:${token.url}`;
      }

      // return uploadExt(token.url, data).then(() => {
      //   return token;
      // });
    return needlePost(token.url, data)
            .then(()=> {
              return token;
            }, () => {
              console.log(param.fileName+'###'+token.url+'###'+url);
              throw new Error('upload');
            });
    });
}

function getHtml(targetUrl: string, headers) {
  let promise: Promise<Object> = new Promise((resolve, reject) => {
    let param = urlParse(targetUrl);
    let options = {
      host: param.host,
      path: param.path,
      headers
    };
    var req = httpGet(options, function (response) {
      response.setEncoding('utf-8');  //二进制binary
      let data: string = '';
      response.on('data', function (res) {    //加载到内存
        data += res;
      }).on('end', function () {
        resolve({
          data: data,
          cookie: response.headers['set-cookie']
        });
      });
    });
    req.on('error', function(err) {
      reject(err);
    });
	});
	return promise;
}