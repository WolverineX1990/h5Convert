'use strict';
var request = require('./../request');
var querystring = require('querystring');
var config = require('./../config').maka;
class MakaUser {
	constructor(name, pwd) {
		this.name = name;
		this.pwd = pwd;
		this.url = config.severHost + 'designer/login';
	}

	/**
	 * [login 登录]
	 * @return {[type]} [description]
	 */
	login() {
		var postData = querystring.stringify({
			email: this.name,
			password: this.pwd
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
				for(var i = 0;i<that.cookie.length;i++) {
					var cookie = that.cookie[i];
					var reg = /Makauid=([\d]+);/
					if(reg.test(cookie)) {
						that.info = cookie.match(reg)[1];
					}
				}
				resolve(that.info);
			}, function(err) {
				reject(err);
			});
		});
		return promise;
	}
}

module.exports = MakaUser;