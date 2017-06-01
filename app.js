var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/2a61b6a3-8e64-4df0-825d-e3d9cb583178?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s//0fHFfd7w';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
// api.rabToEqx(rabbitpreUrl)
// 	.then(res=>console.log('convert success'))
//     .catch(err=>console.log(err));
api.eqxToRabbit(eqxUrl)
	.then(res=>console.log('convert success'))
	.catch(err=>console.log(err));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));