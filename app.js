var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/45561cde-251a-4527-b1dd-19c1cdae3088?mobile=1';
// var eqxUrl = 'http://h5.eqxiu.com/s//lje2U4Zq';
var eqxUrl = 'http://h5.eqxiu.com/s//2llzhv6S';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
// api.rabToEqx(rabbitpreUrl).then(res=>console.log('convert success'));
api.eqxToRabbit('http://h5.eqxiu.com/s//ompGe2e2')
	.then(res=>console.log('convert success'))
	.catch(err=>console.log(err));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));