// var makaUpload = require('./makaUpload');
// var rabUpload = require('./rabUpload');
// var updateRabbit = require('./updateRabbit');
// var mydb = require('./mydb');
// var cryptoTest = require('./cryptoTest');
// var eqxCrawler = require('./eqxCrawler');
// var uploadTest = require('./uploadTest');
// var convertpath = require('./convertpath');
// var rabLogin = require('./rabLogin');
// rabLogin();
// updateRabbit();
// makaUpload();
// rabUpload();
// mydb();
// cryptoTest();
// convertpath();
// eqxCrawler();
// uploadTest();
// import fetch from 'node-fetch';
import upload from './uploadTest';

// fetch('http://s1.eqxiu.com/eqs/page/127664568?code=88lFEvLI&time=1529308702000', { 
//   method: 'GET'
// }).then(res=>{
//   return res.json()
// }).then(res=>{
//   console.log(res);
// })

// import { get } from './../core/request/index';
// import * as fs from 'fs';

// get({url: 'http://s1.eqxiu.com/eqs/page/127664568?code=88lFEvLI&time=1529308702000'})
//   .then(res=>{
//     fs.writeFile('a.txt', res.data, 'utf8', function() {
//       console.log(1)
//     })
//   });


upload();