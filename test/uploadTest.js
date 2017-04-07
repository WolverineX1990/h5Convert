var uploader = require('./../core/scene/uploader');
var reg = /viewBox="([\s|\d]*)"/
uploader.getSvg('http://res1.eqh5.com/FsxVqjDrfF5mHFvcyFePqHGXKA5C').then(function(res) {
	var result = res.match(reg)[1];
	var arr = result.split(' ');
	console.log(arr);
});