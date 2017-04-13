makaService.getOssSts2(user.info.token).then(res => {
	var token = JSON.parse(res).data;
	utils.getResource(url).then(res=>{
		var binary = new Buffer(res, 'binary');
		var path = '/' + token.uploadPath +'images/' + utils.randomStr() +'.jpg';
		var resource = '/' + token.bucket + path;
		var header = makaSign(token, binary, resource);
		var param = URL.parse(token.hostId);
		var url = param.protocol + '//' + token.bucket + '.' + param.host + path;
		console.log(url);
		makaService.upload(url, binary, header).then(res=>console.log(1));
	});
});