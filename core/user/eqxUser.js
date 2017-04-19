'use strict';
var request = require('./../request');
var querystring = require('querystring');
var config = require('./../config').eqx;
class EqxUser {
	constructor(name, pwd) {
		this.name = name;
		this.pwd = pwd;
		this.url = config.eqxSeverHost + 'login';
	}

	/**
	 * [login 登录]
	 * @return {[type]} [description]
	 */
	login() {
		var postData = querystring.stringify({
			username: this.name,
			password: this.pwd
		});
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			request.post({
				url: that.url,
				data: postData,
				headers: {
					Origin: config.eqxOrigin
				}
			}, {
				getCookie: true
			}).then(function(res) {
				that.cookie = res.cookie;
				var data = JSON.parse(res.data);
				that.info = data.obj;
				resolve(that.info);
			}, function(err) {
				reject(err);
			});
		});
		return promise;
	}
}

module.exports = EqxUser;