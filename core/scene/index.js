'use strict';
var utils = require('./../utils');
var services = require('./services');
var uploader = require('./uploader');
/**
 * 易企秀场景
 */
class Scene {
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

	/**
	 * [propertys 设置属性信息]
	 * @param  {[type]} pro [description]
	 * @return {[type]}     [description]
	 */
	set propertys(pro) {
		for(var key in pro) {
			this.data[key] = pro[key];
		}
	}
	
	toRabbitpre() {
		console.log(1);	
	}

	toMaka() {

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
	 * [loadPages 加载场景的所有页面数据]
	 * @return {[type]} [description]
	 */
	loadPages() {
		return services.getPages(this.data.id).then(res => {
			this.pages = JSON.parse(res).list;
			this.currentPage = this.pages[0];
			return this;
		});
	}

	/**
	 * [savePage 保存一页]
	 * @param  {[type]} json [description]
	 * @return {[type]}      [description]
	 */
	savePage(json) {
		return services.savePage(json);
	}

	/**
	 * [insertPage 插入一页]
	 * @return {[type]} [description]
	 */
	insertPage() {
		return services.createPage(this.currentPage.id).then(res => {
			this.currentPage = JSON.parse(res).obj;
			this.pages.push(this.currentPage);
			return this;
		});
	}

	/**
	 * [uploadImg 上传图片]
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	uploadImg(url) {
		if(this.imageToken) {
			return uploader.getBase64(url).then(res=> uploader.upload(res, this.imageToken));
		} else {
			return services.getUpToken('image').then(res=>{
				this.imageToken = JSON.parse(res).map.token;
				return this.uploadImg(url);
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
	/**
	 * [publish 保存设置并发布]
	 * @return {[type]} [description]
	 */
	publish() {
		return services.saveSetting(this.data).then(res=>{
			return services.publish(this.data.id);
		});
	}
}

module.exports = Scene;