var api = require('./core/api');

// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/1aa3510f-f9b7-4085-883d-1b11f5cb6ea0?mobile=1';
// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/1177f127-aca7-4c2f-b6c8-7dca3bd1426a?mobile=1';
// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/e645e8c6-1756-4eb0-9de6-72774f95e830?mobile=1';
// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/a8667a8d-d77a-4a0d-b2b0-516cb3c5d00f?mobile=1';\
// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/0f3bedc1-396b-46ec-b1eb-48952f1c93a9?mobile=1';
var eqxUrl = 'http://h5.eqxiu.com/s//U3srOsDl';
//http://h5.eqxiu.com/s//bgn5lUc1
//http://h5.eqxiu.com/s//iaptgUlz
 
// api.rabToEqx(rabbitpreUrl).then(res2=>console.log('convert success'));
debugger;
api.eqxToMaka(eqxUrl).then(res=>console.log('convert success'));




















// 写一个http 拦截器，所有错误的拦截