'use strict';
var utils = require('./../utils');
var service = require('./service');
var URL = require('url');
var sign = require('./sign');
var insertRabbitPage = require('./insertRabbitPage');
var insertScenePage = require('./insertScenePage');
var crypto = utils.crypto;
var fileHost = 'http://res3.maka.im/';

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
	
	toScene(scene) {
		scene.propertys = {
			name: this.data.title,
			description: this.data.content
		};
		var page = this.pages.shift();
		console.log('page:'+this.pages.length);
		if(page) {
			return insertScenePage(scene, page).then(res=> this.toScene(scene));	
		} else {
			return setEqxMeta(scene, this.data);
		}
	}

	getJson() {
		return utils.getResource(this.data.json_url).then(res=>{
			this.jsonData = JSON.parse(res);
			this.page = this.jsonData.data.pdata.json;
			return this.jsonData;
		});
	}

	toRabbit(rabbit) {
		return setRabMeta(rabbit, this.data).then(res=>insertRabbitPage(rabbit, this.pages));
	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(res) {
		var dataReg = /window.projectVersion[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
        return utils.getPageData(res, dataReg).then(res => {
        	this.data = JSON.parse(res);
        	return this.loadViewPages();
        }, error=>console.log(error));
	}

	loadViewPages(){
		return service.getViewData(this.data.uid, this.data.id, this.data.p_version).then(res=>{
			var data = JSON.parse(res).data.pdata;
			this.pages = data.json;
			this.data.music = data.music;
			return this;
		});
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
				var value = {url: url, path: path};
				return service.upload(url, binary, header).then(()=>value);
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

function setRabMeta(rabbit, makaMeta) {
	rabbit.data.name = makaMeta.title;
	rabbit.data.desc = makaMeta.content;
	rabbit.data.in = 'move';
	rabbit.data.publish = true;
	var reg = /^http/;
	return rabbit.setCover(makaMeta.thumb).then(res=> {
		if(makaMeta.music && makaMeta.music.id) {
			var audio = makaMeta.music.id;
			if(!reg.test(audio)) {
				audio = fileHost + audio;
			}
			return rabbit.setBgAudio(audio);
		} else {
			return res;
		}
	});
}

/**
 * [setEqxMeta 设置易企秀场景属性]
 * @param {[type]} data  [description]
 * @param {[type]} scene [description]
 */
function setEqxMeta(scene, makaMeta) {
	if(makaMeta.thumb){
		return scene.uploadImg({
			type: 'image',
			url: makaMeta.thumb
		}).then(res=> {
			var key = JSON.parse(res).key;
			scene.propertys = {
				cover: key
			};
			if(makaMeta.music.id) {
				var audio = makaMeta.music.id;
				if(!reg.test(audio)) {
					audio = fileHost + audio;
				}
				return scene.uploadAudio(audio).then(res1=>{
					var key = JSON.parse(res1).key;
					scene.propertys = {
						bgAudio: JSON.stringify({
							name: '',
							url: key
						})
					};
				 	return scene.publish();
				});
			} else {
				return scene.publish();
			}
		});
	} else if(makaMeta.music.id) {
		var audio = makaMeta.music.id;
		if(!reg.test(audio)) {
			audio = fileHost + audio;
		}
		return scene.uploadAudio(audio).then(res1=>{
			scene.propertys = {
				bgAudio: {
					name: '',
					url: key
				}
			};
		 	return scene.publish();
		});
	} else {
		return scene.publish();
	}
}