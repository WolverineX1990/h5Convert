'use strict';
var utils = require('./../utils');
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
		if(this.ossConfig) {
			if(obj.type == 'image') {
				return uploader.getBase64(obj.url).then(res=> uploader.upload(res, this.imageToken));
			} else if(obj.type == 'svg') {
				return uploader.getSvg(obj.url).then(res=> {
					var reg = /viewBox="([\s|\d]*)"/;
					var result = res.match(reg)[1];
					var arr = result.split(' ');
					var svg = res.replace('<svg', '<svg width="'+arr[2]+'" height="'+ arr[3] +'"');
					var base64 = new Buffer(svg, 'binary').toString('base64');
					return uploader.upload(base64, this.imageToken);
				});
			}
		} else {
			return services.getUpToken('image').then(res=>{
				this.imageToken = JSON.parse(res).map.token;
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
		if(this.audioToken) {
			return uploader.getBase64(url).then(res=> uploader.upload(res, this.audioToken));;
		} else {
			return services.getUpToken('audio').then(res=>{
				this.audioToken = JSON.parse(res).map.token;
				return this.uploadAudio(url);
			});
		}
	}
}

module.exports = Maka;