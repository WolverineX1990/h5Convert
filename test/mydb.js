var levelup = require('levelup')
var db = require('./../core/db');
var utils = require('./../core/utils');

function mydb() {
  db.del('rab-eqx-890ec720-086e-11e5-8d77-696ea1f9936d').then(res=>console.log(res));
  // db.put('name',{url:'111'}).then(res=>console.log(res));
  // db.get('name').then(res=>console.log(res), err=>console.log('err'+err));
  // utils.checkExist('name').then(res=>console.log(res))
  // 		.then(res=>console.log(1))
  // 		.catch(err=>console.log(err));
}

module.exports = mydb;