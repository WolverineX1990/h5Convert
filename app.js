var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/e8431348-d4be-443e-b6f3-d90f26cb3c77?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s//pRns7WcN';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
api.rabToEqx(rabbitpreUrl)
	.then(res=>console.log('convert success'))
    .catch(err=>console.log(err));
// api.eqxToRabbit(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));