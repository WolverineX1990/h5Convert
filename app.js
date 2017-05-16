var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/f1d53835-29b7-41c0-8068-67ced2038465?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s//SC5RYck7';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
// api.rabToEqx(rabbitpreUrl)
	// .then(res=>console.log('convert success'))
    // .catch(err=>console.log(err));
api.eqxToRabbit(eqxUrl)
	.then(res=>console.log('convert success'))
	.catch(err=>console.log(err));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));