'use strict';
var utils = require('./../utils');
var insertScenePage = require('./insertScenePage');
var compTypes = {
	'image': 4,
	'text': 2
};
/**
 * 兔展场景
 */
class Rabbitpre {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	toScene(scene) {
		var page = this.pages.shift();
		// var page = this.pages[0];
		// this.pages = [];
		console.log('page:'+this.pages.length);
		if(page) {
			return insertScenePage(scene, page).then(res=> this.toScene(scene));	
		} else {
			return this;
		}
	}

	toMaka() {

	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(res) {
		if(res.indexOf('Moved Temporarily') > -1) {
	        var reg = /Moved Temporarily. Redirecting to[\s]*([\w|\s|\W]+)/;
	        utils.getHtml(res.match(reg)[1]).then(res=>this.loadSuc(res));
	    } else {
	    	var dataReg = /var[\s|\w]*pageData[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
	        return utils.getPageData(res, dataReg).then(res => {
	        	this.data = res;
	        	this.pages = JSON.parse(res).pages;
	        	return res;
	        }, error=>console.log(error));
	    }
	}
}

module.exports = Rabbitpre;