var urlMap = {
	'http://res.eqh5.com/group1/M00/B2/1E/yq0KXVZysSmAJnUxAAACRsXlJSU636.svg': 'http://res2.maka.im/shapeSVG/svg/Default/SVG/shape03.svg',
	'http://res.eqh5.com/group1/M00/B1/A3/yq0KXFZysi-ACYaKAAACDQH4Nes625.svg': 'http://res2.maka.im/shapeSVG/svg/Default/SVG/shape01.svg'
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