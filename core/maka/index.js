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
}

module.exports = Maka;