var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/81c484c1-d700-40d6-b90a-6bde8e7ee5bc?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s/6SeOjfHl';
var makaUrl = 'http://u546504.zuodanye.maka.im/viewer/XTAMTBYF?ts=1503911876';
// api.makaToRabbitPoster(makaUrl)
// 	.then(()=>console.log('convert success'))
// 	.catch(err=>console.log(err));
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