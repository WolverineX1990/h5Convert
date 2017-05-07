var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/6daa3999-8016-42a5-89f6-e38ffcde1f40?mobile=1';
// var eqxUrl = 'http://h5.eqxiu.com/s/U3srOsDl';
var eqxUrl = 'http://h5.eqxiu.com/s//twpNBzOM';
//http://h5.eqxiu.com/s//bgn5lUc1
//http://h5.eqxiu.com/s//iaptgUlz
 
// api.rabToEqx(rabbitpreUrl).then(res=>console.log('convert success'));
api.eqxToRabbit(eqxUrl).then(res=>console.log('convert success'))
// api.eqxToMaka(eqxUrl).then(res=>console.log('convert success'));




















// 写一个http 拦截器，所有错误的拦截