'use strict';
var querystring = require('querystring');
var config = require('./../config').eqx;
var User = require('./user');

class EqxUser extends User {
	constructor(name, pwd) {
		super(name, pwd);
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

		return this.submit(postData, {Origin: config.eqxOrigin})
			.then(res=>{
				this.cookie = res.cookie;
				var data = JSON.parse(res.data);
				this.info = data.obj;
				return this;
			});
	}
}

module.exports = EqxUser;