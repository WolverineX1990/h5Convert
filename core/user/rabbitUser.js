'use strict';
var config = require('./../config').rabbit;
var service = require('./../rabbit/service');
var User = require('./user');
var fetch = require('node-fetch');

class RabbitUser extends User {
	constructor(name, pwd) {
		super(name, pwd);
		// this.url = 'http://eps.rabbitpre.com/api/user/login';
		this.url = 'https://passport.rabbitpre.com/api/sso/login';
	}

	/**
	 * [login 登录]
	 * @return {[type]} [description]
	 */
	login() {
		var body = {
			account: this.name,
			password: this.pwd
		};

		return fetch(this.url, { 
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => {
			this.cookie = [res.headers.get('set-cookie')];
			return res.json();
		})
		.then(json => {
			this.info = json.data;
			return json;
		});
	}

	getSession() {
		return service.getUserInfo()
							.then(res=>{
								this.cookie.push(res.headers.get('set-cookie'));
								return res.json();
							})/*.then(()=>service.getSid())
							.then(res1=>{
								this.cookie.push(res1.headers.get('set-cookie'));
								return res1.json();
							})*/
		// return service.getSso().then(res=>{
		// 	for(var i = 0;i<res.cookie.length;i++) {
		// 		this.cookie.push(res.cookie[i]);	
		// 	}
			// var url = JSON.parse(res.data).data.url;
			// return service.getTicket(url).then(res=>{
			// 	for(var i = 0;i<res.cookie.length;i++) {
			// 		this.cookie.push(res.cookie[i]);	
			// 	}
			// 	return this.info;
			// });
		// });
	}
}

module.exports = RabbitUser;