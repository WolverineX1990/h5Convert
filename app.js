var api = require('./core/api');

var rabbitpreUrl = 'http://www.rabbitpre.com/template/preview/7af60dfb-43ad-49e6-90c3-d97372993650?mobile=1';
// var eqxUrl = 'http://h5.eqxiu.com/s//gZHqwAKS';
var eqxUrl = 'http://h5.eqxiu.com/s//R1s3YblT';

// api.rabToEqx(rabbitpreUrl).then(res=>console.log('convert success'));
// api.eqxToRabbit(eqxUrl).then(res=>console.log('convert success'))
// api.eqxToMaka(eqxUrl).then(res=>console.log('convert success'));
// api.copyEqx(eqxUrl).then(res => console.log('copy success'));
api.copyRabbit(rabbitpreUrl).then(res=>console.log('copy success'));