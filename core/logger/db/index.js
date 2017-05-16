'use strict';
var mysql = require('mysql');
class Db {
	constructor(host, database, user, pwd) {
		this.host = host;
		this.database = database;
		this.user = user;
		this.pwd = pwd;
		this.client = mysql.createConnection({
				host: this.host,
				user: this.user,
				password: this.pwd,
				database: this.database
			});
		this.client.connect();
	}

	execute(sql) {
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			that.client.query(sql, function(err, rows, fields) {
				if(err) {
					reject(err);
				} else {
					resolve(rows)
				}
			});
		});
		return promise;
	}

	destory() {
		var that = this;
		var promise = new Promise(function func(resolve, reject){
			that.client.end();
			resolve();
		});
		return promise;
	}
}

module.exports = Db;