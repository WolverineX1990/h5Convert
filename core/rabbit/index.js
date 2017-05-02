'use strict';
var utils = require('./../utils');
var insertScenePage = require('./insertScenePage');
var service = require('./service');
var extend = utils.extend;
var needle = require('needle');
/**
 * 兔展场景对象
 */
class Rabbit {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	/**
	 * [toScene 转易企秀]
	 * @param  {[type]} scene [description]
	 * @return {[type]}       [description]
	 */
	toScene(scene) {
		scene.propertys = {
			name: this.data.name,
			description: this.data.desc
		};
		var page = this.pages.shift();
		console.log('page:'+this.pages.length);
		if(page) {
			return insertScenePage(scene, page).then(res=> this.toScene(scene));	
		} else {
			return setEqxMeta(this.data, scene);
		}
	}

	toMaka() {

	}

	/**
	 * [loadData 加载url中数据]
	 * @return {[type]} [description]
	 */
	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	/**
	 * [loadSuc loadData的回调处理]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	loadSuc(res) {
		if(res.indexOf('Moved Temporarily') > -1) {
	        var reg = /Moved Temporarily. Redirecting to[\s]*([\w|\s|\W]+)/;
	        return utils.getHtml(res.match(reg)[1]).then(res=>this.loadSuc(res));
	    } else {
	    	var dataReg = /var[\s|\w]*pageData[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
	        return utils.getPageData(res, dataReg).then(res => {
	        	this.data = JSON.parse(res);
	        	this.pages = this.data.pages;
	        	return res;
	        }, error=>console.log(error));
	    }
	}

	uploadImg(obj) {
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			var type = 'IMAGE';
			var fileName = 'upload.png';
			var contentType = 'image/png';
			if(obj.type == 'svg') {
				fileName = 'upload.svg';
				contentType = 'image/svg+xml';
			}
			that.getUploadToken(type, fileName).then(data=>{
				utils.getResource(obj.url).then(res=> {
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: fileName,
					    content_type: contentType
					};

					var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
				    needle.post(url, data, {multipart: true}, function(err, resp, body) {
				    	// console.log(resp.statusCode);
				    	resolve(data.key);
					});
				});
			});
		});
		return promise;
		
	}

	uploadAudio(url) {
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			var type = 'MUSIC';
			var fileName = 'upload.mp3';
			var contentType = 'audio/mp3';
			that.getUploadToken(type, fileName).then(data=>{
				utils.getResource(url).then(res=> {
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: fileName,
					    content_type: contentType
					};

					var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
				    needle.post(url, data, {multipart: true}, function(err, resp, body) {
				    	resolve(data.key);
					});
				});
			});
		});
		return promise;
	}

	getUploadToken(type, fileName) {
		var data = {
			serverType: 'A',
			type: type,
			count: 1,
			files: JSON.stringify([{"name": fileName}]),
			appid: this.data.id, //场景相关信息
			userfolder: -1,
			isAjax: true
		};
		return service.getUploadToken(data).then(res=> {
			var token = JSON.parse(res)[0];
			var param = {
				'OSSAccessKeyId': token.accessKey,
				'policy': token.policy,
				'signature': token.token,
				'key': token.key,
				'x-oss-meta-ext': token.xparams.ext,
				'x-oss-meta-userid': token.xparams.userid,
				'x-oss-meta-appid': token.xparams.appid,
				'x-oss-meta-userfolder': token.xparams.userfolder,
				'x-oss-meta-type': token.xparams.type,
				'x-oss-meta-serverType': token.xparams.serverType,
				'x-oss-meta-bucket': token.xparams.bucket
			};
			return param;
		});
	}

	save() {
		var data = {
			data: JSON.stringify(this.data),
			isAjax: true
		};
		console.log(data);
		return service.createTemplate(data);
	}
}

module.exports = Rabbit;

/**
 * [setEqxMeta 设置易企秀场景属性]
 * @param {[type]} data  [description]
 * @param {[type]} scene [description]
 */
function setEqxMeta(data, scene) {
	if(data.imgurl){
		return scene.uploadImg({
			type: 'image',
			url: data.imgPath
		}).then(res=> {
			var key = JSON.parse(res).key;
			scene.propertys = {
				cover: key
			};
			if(data.musicPath) {
				return scene.uploadAudio(data.musicPath).then(res1=>{
					var key = JSON.parse(res1).key;
					scene.propertys = {
						bgAudio: JSON.stringify({
							name: data.musicname,
							url: key
						})
					};
				 	return scene.publish();
				});
			} else {
				return scene.publish();
			}
		});
	} else if(data.musicPath) {
		return scene.uploadAudio(data.musicPath).then(res1=>{
			scene.propertys = {
				bgAudio: {
					name: data.musicname,
					url: key
				}
			};
		 	return scene.publish();
		});
	} else {
		return scene.publish();
	}
}