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

	set user(user) {
		this._user = user;
	}

	get user() {
		return this._user;
	}

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

	loadPages() {
		return services.getPages(this.data.id).then(res => {
			this.pages = JSON.parse(res).list;
			this.currentPage = this.pages[0];
			return this;
		});
	}

	savePage(json) {
		return services.savePage(json);
	}

	insertPage() {
		return services.createPage(this.currentPage.id).then(res => {
			this.currentPage = JSON.parse(res).obj;
			this.pages.push(this.currentPage);
			return this;
		});
	}

	uploadImg(url) {
		if(this.qiniuToken) {
			return uploader.getBase64(url).then(res=> uploader.upload(res, this.qiniuToken));
		} else {
			return services.getUpToken().then(res=>{
				this.qiniuToken = JSON.parse(res).map.token;
				return this.uploadImg(url);
			});
		}
	}

	publish() {
		return services.saveSetting(this.data).then(res=>services.publish(this.data.id));
	}
}

module.exports = Scene;