var logger = require('./../core/logger');

function mydb() {
	logger.checkExist('100',2).then(res=>logger.checkExist('100',2))
			.then(res=>console.log(res))
			.catch(err=>console.log(err));
	// logger.insert('100',2,'test');
	// 	.catch(err=>console.log(err));
	logger.del(48134433, 1).then(res=>console.log(res))
		.catch(err=>console.log(err));
}

module.exports = mydb;