'use strict';
var utils = require('./../utils');
var services = require('./services');
var uploader = require('./uploader');
var insertMakaPage = require('./insertMakaPage');
var fileHost = 'http://res.eqh5.com/';
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

	toMaka(maka) {		
		return setMakaMeta(maka, this.data).then(res=>insertMakaPage(maka, this.pages));
	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(res) {
		var dataReg = /var[\s|\w]*scene[\s|\w]*=[\s|\w]*{([\s|\w|\W]+);/;
        return utils.getPageData(res, dataReg).then(res => {
        	this.data = eval("("+res+")");
        	return this.loadViewPages();
        }, error=>console.log(error));
	}

	loadViewPages() {
		return services.getViewData(this.data.id, this.data.code).then(res=>{
			this.pages = JSON.parse(res).list;
			return this;
		});
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
	 * @param  {[type]} obj [description]
	 * @return {[type]}     [description]
	 */
	uploadImg(obj) {
		if(this.imageToken) {
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

function setMakaMeta(maka, eqxMeta) {
	maka.data.title = eqxMeta.name;
	maka.data.content = eqxMeta.description;
	var url = this.data.cover;
	var reg = /^http/;
	if(!reg.test(url)) {
		url = fileHost + url;
	}
	return maka.uploadImg({url: url}).then(res=>{
		maka.data.thumb = res;
		if(eqxMeta.bgAudio && eqxMeta.bgAudio.url) {
			return maka.uploadAudio(eqxMeta.bgAudio.url).then(function(res) {
				return '';
			});
		}

		return res;
	});
}