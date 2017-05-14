var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/a8a19453-2a69-4ce0-8501-d192e02a6939?mobile=1';
var eqxUrl = '';
var makaUrl = 'http://viewer.maka.im/pcviewer/T_BJIPAXSV?mode=storeTemplate&TempAdmode=true';
// api.makaToRabbit(makaUrl).then(res=>console.log('convert success'));
api.rabToEqx(rabbitpreUrl).then(res=>console.log('convert success'))
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