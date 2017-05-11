var levelup = require('levelup');
var db = levelup('./mydb');
function get(key) {
	var promise = new Promise(function func(resolve, reject){
		db.get(key, function (err, value) {
	    	if (err) {
	    		reject(err);
	    	}
	    	resolve(value)
	  	});
	});
	return promise;
}

function put(key, value) {
	var promise = new Promise(function func(resolve, reject){
		db.put(key, value, function (err) {
			if(err) {
				reject(err)
			}
			resolve(value);
		});
	});
	return promise;
}

function del(key) {
	var promise = new Promise(function func(resolve, reject){
		db.del(key, function (err) {
	        if (err) {
	        	reject(err)
	        }
	        resolve(key);
	    })
	});
	return promise;
}

module.exports = {
	get: get,
	put: put,
	del: del
};