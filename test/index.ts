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
// import upload from './uploadTest';
import upload from './rabUploadMusic';

var zlib = require('zlib');
// var gunzipStream = zlib.createGunzip();
// upload();

//====================================================
// 访问www.meitulu.com得到pagecode
// 2017年11月6日
//====================================================
var http = require("http");

var options = {
  "method": "GET",
  "host": "127.0.0.1",
  "port": '8888',
  "path": "http://h5.eqxiu.com/s/iFlxHjA1",
  "headers": {
    "cache-control": "no-cache",
    Host: 'h5.eqxiu.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
    // "postman-token": "f26346e2-fb94-9683-3012-9ef35c43544c"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];
  let isGzip = res.headers['content-encoding'].indexOf('gzip') != -1;
  // res.pipe(gunzipStream).pipe(toWrite);

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    body = zlib.unzipSync(body);
    console.log(body.toString());
  });
});

req.end();

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


// upload();