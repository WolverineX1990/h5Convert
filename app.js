var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/43bc7c0d-030c-4c7d-886b-b6bca945c744?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s//NkQIHjuf';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
// api.rabToEqx(rabbitpreUrl).then(res=>console.log('convert success'));
api.eqxToRabbit(eqxUrl).then(res=>console.log('convert success'));
// api.makaToEqx(makaUrl).then(res=>console.log('convert success'));
// api.eqxToMaka(eqxUrl).then(res=>console.log('convert success'));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
// api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));