var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/dd1e09c5-3be0-46a4-aa25-1ba2772b5c08?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s/U3srOsDl';
//http://h5.eqxiu.com/s//bgn5lUc1
//http://h5.eqxiu.com/s//iaptgUlz
 
api.rabToEqx(rabbitpreUrl).then(res2=>console.log('convert success'));
// api.eqxToMaka(eqxUrl).then(res=>console.log('convert success'));




















// 写一个http 拦截器，所有错误的拦截