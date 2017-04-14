'use strict';
var utils = require('./../utils');
var service = require('./service');
var URL = require('url');
var sign = require('./sign');
var crypto = utils.crypto;

/**
 * MAKA场景
 */
class Maka {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	/**
	 * [user 设置用户]
	 * @param  {[type]} user [description]
	 * @return {[type]}      [description]
	 */
	set user(user) {
		this._user = user;
	}

	/**
	 * [user 获取用户]
	 * @return {[type]} [description]
	 */
	get user() {
		return this._user;
	}
	
	toScene() {

	}

	getJson() {
		return utils.getResource(this.data.json_url).then(res=>{
			this.jsonData = JSON.parse(res);
			this.page = this.jsonData.data.pdata.json;
			return this.jsonData;
		});
	}

	toRabbitpre() {
		console.log(1);	
	}

	loadData() {
		utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(res) {
		if(res.indexOf('Moved Temporarily') > -1) {
	        var reg = /Moved Temporarily. Redirecting to[\s]*([\w|\s|\W]+)/;
	        utils.getHtml(res.match(reg)[1]).then();
	    } else {
	    	var dataReg = /var[\s|\w]*pageData[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
	        utils.getPageData(res, dataReg).then(function(res) {

	        });
	    }
	}

	/**
	 * [uploadImg 上传图片]
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	uploadImg(obj) {
		if(this.ossSts2) {
			return utils.getResource(obj.url).then(res=> {
				var binary = new Buffer(res, 'binary');
				var imgUrl = obj.url.split('?image')[0];
				var suffixName = /\.[^\.]+$/.exec(imgUrl); 
				var path = '/' + this.ossSts2.uploadPath +'images/' + utils.randomStr() + suffixName;
				var resource = '/' + this.ossSts2.bucket + path;
				var header = getOssHeader(this.ossSts2, binary, resource, 'image/jpeg');
				var param = URL.parse(this.ossSts2.hostId);
				var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
				return service.upload(url, binary, header).then(()=>url);
			});
		} else {
			return service.getOssSts2(this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.uploadImg(obj);
			});
		}
	}
	/**
	 * [uploadAudio 上传音乐]
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	uploadAudio(url) {
		if(this.ossSts2) {
			return uploader.getBase64(url).then(res=> uploader.upload(res, this.audioToken));;
		} else {
			return service.getOssSts2(this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.uploadAudio();
			});
		}
	}
	/**
	 * [save 保存]
	 * @return {[type]} [description]
	 */
	save() {
		if(this.ossSts2) {
			var code = this.data.id;
			var string = JSON.stringify(this.jsonData);
			var binary = new Buffer(string, 'binary');
			var path = '/' + this.ossSts2.uploadPath +'template/' + code + '/' + code + '_v1.json';
			var resource = '/' + this.ossSts2.bucket + path;
			var header = getOssHeader(this.ossSts2, binary, resource, 'text/json');
			var param = URL.parse(this.ossSts2.hostId);
			var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
			return service.upload(url, binary, header).then(res=> service.saveTemplate(code, 1));

		} else {
			return service.getOssSts2(this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.save();
			});
		}
	}
}

function getOssHeader(token, data, resource, contentType) {
	var credentials = token.token.Credentials;
	var ContentMD5 = crypto.md5(data, 'base64');
	var header = {
		'method': 'PUT',
		'Content-MD5': ContentMD5,
		'Content-Type': contentType,
		'x-oss-date': (new Date()).toUTCString(),
		'x-oss-security-token': credentials.SecurityToken,
		'x-sdk-client': ''
	};
	var signature = sign(credentials, header, resource);
	var auth = 'OSS ' + credentials.AccessKeyId + ':' + signature;
	header.Authorization = auth;
	return header;
}

module.exports = Maka;