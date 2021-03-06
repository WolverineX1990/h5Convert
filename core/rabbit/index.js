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

	publish() {
		return service.publishTpl(this.data);
	}

	setCover(url) {
		return this.uploadRes({url: url, type: 'cover'}).then(res=>{
			var xparams = {
					'keyprev': res['x-oss-meta-keyprev'],
					'type': res['x-oss-meta-type'],
					'serverType': res['x-oss-meta-serverType'],
					'bucket': res['x-oss-meta-bucket'],
					'filename': 'upload.png'
				};

			var data = {
				file: {
					bucket: xparams.bucket,
					key: res.key,
					keyprev: xparams.keyprev,
					name: xparams.filename,
					path: '//tenc.rabbitpre.com/' + res.key,
					server: xparams.serverType,
					size: 100,
					type: xparams.type,
					userfolder: -1,
					userid: '19d9e8bf-60f0-41f7-8865-9c6846c8da27'
				}
			}
			this.data.imgKey = res.key;
			this.data.imgServer = xparams.serverType;
			return service.upload(data).then(res=>{
				var data = res.data;
				this.data.imgId = data.id;
				this.data.imgBucket = xparams.bucket;
				this.data.imgPath = data.path;
				return true;
			});
		});
	}

	setBgAudio(url) {
		return this.uploadRes({url: url, type: 'audio'}).then(res=>{
			var xparams = {
				'keyprev': res['x-oss-meta-keyprev'],
				'userid': res['x-oss-meta-userid'],
				'appid': res['x-oss-meta-appid'],
				'userfolder': res['x-oss-met09a-userfolder'],
				'type': res['x-oss-meta-type'],
				'serverType': res['x-oss-meta-serverType'],
				'bucket': res['x-oss-meta-bucket'],
				'filename': 'upload.mp3'
			};
			// var data = {
			// 	key: res.key,
			// 	xparams: JSON.stringify(xparams),
			// 	isAjax: true
			// };
			var data = {
				file: {
					bucket: xparams.bucket,
					key: res.key,
					keyprev: xparams.keyprev,
					name: xparams.filename,
					path: '//tenc.rabbitpre.com/' + res.key,
					server: xparams.serverType,
					size: 100,
					type: xparams.type,
					userfolder: -1,
					userid: res['x-oss-meta-userid']
				}
			}
			return service.uploadMusic(data).then(json=>{
				this.data.bgmusic = {
					musicBucket: xparams.bucket,
					musicKey: res.key,
					musicName: xparams.filename,
					musicServer: xparams.serverType,
					musickId: json.data.id,
					src: json.data.path
				};
				return this.data.music=json.data.id;
			});
		});
	}

	uploadRes(obj) {
		var that = this;
		var promise = new Promise(function(resolve, reject){
			var type = 'IMAGE';
			var fileName = 'upload.png';
			var contentType = 'image/png';
			if(obj.type == 'cover') {
				type = 'FILE';	
			} else if(obj.type == 'audio') {
				type = 'MUSIC';
				fileName = 'upload.mp3';
				contentType = 'audio/mp3';
			}else if(obj.type == 'svg') {
				fileName = 'upload.svg';
				// contentType = 'image/svg+xml';
				contentType = 'application/octet-stream';
			}
			that.getUploadToken(type, fileName).then(token=>{
				utils.getResource(obj.url).then(res=> {
					var data = extend({}, token);
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: fileName,
					    content_type: contentType
					};

					var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
				    needle.post(url, data, {multipart: true}, function(err, resp, body) {
				    	if(fileName == 'upload.svg') {
				    		// console.log(resp.statusCode); 
				    		// console.log('http://tenc1.rabbitpre.com/' + token.key);	
				    	}
				    	
				    	resolve(token);
					});
				});
			});
		});
		return promise;
	}

	uploadQiniu(obj) {
		var that = this;
		var promise = new Promise(function(resolve, reject){
			var type = 'IMAGE';
			var fileName = 'upload.png';
			var contentType = 'image/png';
			if(obj.type == 'cover') {
				type = 'FILE';	
			} else if(obj.type == 'audio') {
				type = 'MUSIC';
				fileName = 'upload.mp3';
				contentType = 'audio/mp3';
			}else if(obj.type == 'svg') {
				fileName = 'upload.svg';
				contentType = 'image/svg+xml';
			}
			that.getUploadToken(type, fileName).then(token=>{
				utils.getResource(obj.url).then(res=> {
					var data = extend({}, token);
					data.file = {
						buffer: new Buffer(res, 'binary'),
					    filename: fileName,
					    content_type: contentType
					};

					var url = 'http://upload.qiniu.com/';
				    needle.post(url, data, {multipart: true}, function(err, resp, body) {
				    	console.log(resp.statusCode);
				    	console.log(body.toString());
				    	resolve(token);
					});
				});
			});
		});
		return promise;
	}

	uploadSvg(svgDom) {
		var fileName = 'upload.svg';
		var contentType = 'image/svg+xml';
		var that = this;
		var promise = new Promise(function(resolve, reject){
			that.getUploadToken('IMAGE', fileName).then(token=>{
				var data = extend({}, token);
				data.file = {
					buffer: new Buffer(svgDom, 'binary'),
				    filename: fileName,
				    content_type: contentType
				};

				var url = 'http://rabbitpre.oss-cn-shenzhen.aliyuncs.com';
			    needle.post(url, data, {multipart: true}, function(err, resp, body) {
			    	// console.log(resp.statusCode);
			    	// console.log(body.toString());
			    	resolve(token);
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
			files: JSON.stringify([{'name': fileName}]),
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
				'x-oss-meta-type': token.xparams.type,
				'x-oss-meta-serverType': token.xparams.serverType,
				'x-oss-meta-bucket': token.xparams.bucket
			};
			if(type == 'FILE') {
				param['x-oss-meta-keyprev'] = token.xparams.keyprev;
				param['x-oss-meta-ext'] = token.xparams.ext;
			} else if(type == 'IMAGE') {
				param['x-oss-meta-userid'] = token.xparams.userid;
				param['x-oss-meta-appid'] = token.xparams.appid;
				param['x-oss-meta-userfolder'] = token.xparams.userfolder;
				param['x-oss-meta-ext'] = token.xparams.ext;
			} else if(type == 'MUSIC') {
				param['x-oss-meta-userid'] = token.xparams.userid;
				param['x-oss-meta-appid'] = token.xparams.appid;
				param['x-oss-meta-userfolder'] = token.xparams.userfolder;
				param['x-oss-meta-keyprev'] = token.xparams.keyprev;
			}
			return param;
		});
	}

	save() {
		this.data.publish = true;
		return service.saveTemplate(this.data);
	}

	copy(pages) {
		this.data.pages[0].deleted = true;
		for(var i = 0;i<pages.length;i++) {
			var page = pages[i];
			var json = {
				appid: this.data.id,
				row: page.row,
				col: page.col,
				in: page.in,
				out: page.out,
				bgcol: page.bgcol,
				bgimage: page.bgimage,
				bgserver: page.bgserver,
				bgleft: page.bgleft,
				bgtop: page.bgtop,
				cmps: page.cmps
			};
			this.data.pages.push(json);
		}
		return this.save();
	}

	setCmpId(cmp) {
		var data = {
			isAjax: true
		};
		return service.getCmpId(data).then(res=>{
			cmp.cmp_id = JSON.parse(res).data.cmp_id;
			return cmp;
		});
	}
}

module.exports = Rabbit;

/**
 * [setEqxMeta 设置易企秀场景属性]
 * @param {[type]} data  [description]
 * @param {[type]} scene [description]
 */
function setEqxMeta(data, scene) {
	data.musicPath = (/^http/.test(data.musicPath) ? data.musicPath : 'http:' + data.musicPath);
	if(data.imgPath){
		return scene.uploadImg({
			type: 'image',
			url: data.imgPath
		}).then(res=> {
			var key = JSON.parse(res).key;
			scene.propertys = {
				cover: key
			};
			if(data.musicPath) {
				return scene.uploadAudio(data.musicPath).then(()=>scene.publish());
			} else {
				return scene.publish();
			}
		});
	} else if(data.musicPath) {
		return scene.uploadAudio(data.musicPath).then(()=>scene.publish());
	} else {
		return scene.publish();
	}
}