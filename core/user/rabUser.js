'use strict';
var request = require('./../request');
var querystring = require('querystring');
var config = require('./../config').rab;
class MakaUser {
	constructor(name, pwd) {
		this.name = name;
		this.pwd = pwd;
		// this.url = config.severHost + 'designer/login';
		this.url = 'http://eps.rabbitpre.com/api/user/login';
	}

	/**
	 * [login 登录]
	 * @return {[type]} [description]
	 */
	login() {
		var postData = querystring.stringify({
			account: this.name,
			password: this.pwd,
			remember: false//,
			// devkey: ,
		});
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			request.post({
				url: that.url,
				data: postData,
				headers: {
					Origin: config.origin
				}
			}, {
				getCookie: true
			}).then(function(res) {
				that.cookie = res.cookie;
				that.info = JSON.parse(res.data).data;
				resolve(that.info);
			}, function(err) {
				reject(err);
			});
		});
		return promise;
	}
}

module.exports = MakaUser;