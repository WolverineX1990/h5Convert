'use strict';
var request = require('./../request');
var querystring = require('querystring');
var config = require('./../config').rabbit;
var service = require('./../rabbit/service');
class RabbitUser {
	constructor(name, pwd) {
		this.name = name;
		this.pwd = pwd;
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
			remember: false,
			devkey: config.devKey
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
				that.info = JSON.parse(res.data).result;
				resolve(that.info);
			}, function(err) {
				reject(err);
			});
		});
		return promise;
	}

	getSession() {
		return service.getSso({'x-jwt-token': this.info.token}).then(res=>{
			for(var i = 0;i<res.cookie.length;i++) {
				this.cookie.push(res.cookie[i]);	
			}
			
			var url = JSON.parse(res.data).data.url;
			return service.getTicket(url).then(res=>{
				for(var i = 0;i<res.cookie.length;i++) {
					this.cookie.push(res.cookie[i]);	
				}
				return this.info;
			});
		});
	}
}

module.exports = RabbitUser;