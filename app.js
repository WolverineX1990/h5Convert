var api = require('./core/api');

// var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/1aa3510f-f9b7-4085-883d-1b11f5cb6ea0?mobile=1';
var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/1177f127-aca7-4c2f-b6c8-7dca3bd1426a?mobile=1'
// http://www.rabbitpre.com/template/preview/e645e8c6-1756-4eb0-9de6-72774f95e830?mobile=1
api.rabToEqx(rabbitpreUrl).then(res2=>console.log('convert success'));
// 写一个http 拦截器，所有错误的拦截