var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/3f592c86-f705-426d-9c1c-fbca9959fe55?mobile=1';
// var eqxUrl = 'http://h5.eqxiu.com/s//lje2U4Zq';
var eqxUrl = 'http://h5.eqxiu.com/s//2llzhv6S';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
api.rabToEqx(rabbitpreUrl).then(res=>console.log('convert success'));
// api.eqxToRabbit('http://h5.eqxiu.com/s//ompGe2e2')
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl)
// 	.then(res=>console.log('convert success'))
// 	.catch(err=>console.log(err));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));