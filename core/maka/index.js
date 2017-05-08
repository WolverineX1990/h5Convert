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
				var suffixName = /\.[^\.]+$/.exec(imgUrl)[0];
				var path = '/' + this.ossSts2.uploadPath +'images/' + utils.randomStr() + suffixName;
				var resource = '/' + this.ossSts2.bucket + path;
				var type = 'image/jpeg';
				if(suffixName.indexOf('svg') > -1) {
					type = 'image/svg+xml';
					path = '/shapeSVG/svg/Default/SVG/' + utils.randomStr() + suffixName;
					// path = '/' + this.ossSts2.uploadPath +'shapeSVG/' + utils.randomStr() + suffixName;
				} else if(suffixName=='png'){
					type = 'image/png';
				}
				var header = getOssHeader(this.ossSts2, binary, resource, type);
				var param = URL.parse(this.ossSts2.hostId);
				var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
				return service.upload(url, binary, header).then(()=>path);
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
			return utils.getResource(url).then(res=> {
				var binary = new Buffer(res, 'binary');
				var suffixName = /\.[^\.]+$/.exec(url); 
				var path = '/' + this.ossSts2.uploadPath +'audio/' + utils.randomStr() + suffixName;
				var resource = '/' + this.ossSts2.bucket + path;
				var header = getOssHeader(this.ossSts2, binary, resource, 'audio/mp3');
				var param = URL.parse(this.ossSts2.hostId);
				var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
				return service.upload(url, binary, header).then(()=>url);
			});
		} else {
			return service.getOssSts2(this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.uploadAudio(obj);
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
			var binary = new Buffer(string, 'utf8');
			var path = '/' + this.ossSts2.uploadPath +'template/' + code + '/' + code + '_v1.json';
			var resource = '/' + this.ossSts2.bucket + path;
			var header = getOssHeader(this.ossSts2, binary, resource, 'text/json');
			var param = URL.parse(this.ossSts2.hostId);
			var url = param.protocol + '//' + this.ossSts2.bucket + '.' + param.host + path;
			console.log(url);
			return service.upload(url, binary, header).then(res=> service.saveTemplate(code, {
				version: 1,
				thumb: this.data.thumb,
				title: this.data.title,
				content: this.data.content
			}));

		} else {
			return service.getOssSts2(this.user.info.token).then(res=>{
				this.ossSts2 = JSON.parse(res).data;
				return this.save();
			});
		}
	}

	copy() {
		
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