'use strict';
var request = require('./../request');
class User {
	constructor(name, pwd) {
		this.name = name;
		this.pwd = pwd;
	}

	/**
	 * [submit 登录]
	 * @return {[type]} [description]
	 */
	submit(postData, headers) {
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			request.post({
				url: that.url,
				data: postData,
				headers: headers
			}, {
				getCookie: true
			}).then(function(res) {
				resolve(res);
			}, function(err) {
				reject(err);
			});
		});
		return promise;
	}
}

module.exports = User;