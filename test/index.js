var makaUpload = require('./makaUpload');
var rabUpload = require('./rabUpload');
var updateRabbit = require('./updateRabbit');
var mydb = require('./mydb');
var cryptoTest = require('./cryptoTest');
var convertpath = require('./convertpath');
// updateRabbit();
// makaUpload();
// rabUpload();
// mydb();
// cryptoTest();
// convertpath();

var RabbitUser = require('./../core/user/rabbitUser');
var user = new RabbitUser('18519203764', 'rabbit-zcj');
user.login().then(res=>console.log(res));