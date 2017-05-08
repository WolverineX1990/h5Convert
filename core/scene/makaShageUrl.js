var urlMap = {

};

function getShapeUrl(url) {
	var res = urlMap[url];
	if(res) {
		return res;
	} else {
		console.log(' getShapeUrl---shapeurl:' + url);
		return ''
	}
}

module.exports = getShapeUrl;