'use strict';
var querystring = require('querystring');
var config = require('./../config').rabbit;
var service = require('./../rabbit/service');
var User = require('./user');

class RabbitUser extends User {
	constructor(name, pwd) {
		super(name, pwd);
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
		return this.submit(postData, {Origin: config.origin})
			.then(res=>{
				this.cookie = res.cookie;
				this.info = JSON.parse(res.data).result;
				return this;
			});
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