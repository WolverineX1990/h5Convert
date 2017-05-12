var convertpath = require('convertpath');
var utils = require('./../core/utils');

function test() {
	convertpath.parse('test/1.svg');
	console.log(convertpath.toSimpleSvg());
// 	utils.getResource('http://res1.eqh5.com/group1/M00/B1/A3/yq0KXFZysi-ACYaKAAACDQH4Nes625.svg')
// 		 .then(res=>{
// 		 	console.log(convertpath)
// 		 	convertpath.parse(res);
// 		 	console.log(convertpath.toSimpleSvg());
// 		 })
// 		 .catch(err=>console.log(err));
}

module.exports = test;