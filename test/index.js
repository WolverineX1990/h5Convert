var config = require('./../core/config').maka;
var MakaUser = require('./../core/user/makaUser');
var makaService = require('./../core/maka/service');
var Maka = require('./../core/maka');
var Scene = require('./../core/scene');
var user = new MakaUser(config.userName, config.userPwd);
var scene = new Scene('http://h5.eqxiu.com/s/mPRgdwxR');
function loginSuccess(res) {
	makaService.setHeaders({
		Origin: config.origin, 
		cookie: user.cookie
	});	
	makaService.createTemplate().then(res1=>{
		var code = res1.split('=')[1];
		makaService.getTemplate(code).then(res2=>{
			var json = JSON.parse(res2).data;
			var maka = new Maka(json);
			maka.user = user;
			maka.getJson().then(res3=> {
				scene.toMaka(maka).then(res4=>console.log('success'));
			});
		});
	});
}
scene.loadData().then(res=>user.login().then(loginSuccess));


function getJson() {
	var json = [{
			effect: "cubedown",
			bgcolor: " rgba(250,250,250,1)",
			bgpic: "",
			bgpicheight: "1010",
			bgpicwidth: "640",
			bgpictop: "0",
			bgpicleft: "0",
			content: []
		}, {
			effect: "cubedown",
			bgcolor: " rgba(250,250,250,1)",
			bgpic: "",
			bgpicheight: "1010",
			bgpicwidth: "640",
			bgpictop: "0",
			bgpicleft: "0",
			content: []
		}, {
			effect: "cubedown",
			bgcolor: " rgba(250,250,250,1)",
			bgpic: "",
			bgpicheight: "1010",
			bgpicwidth: "640",
			bgpictop: "0",
			bgpicleft: "0",
			content: []
		}
	];

	return json;
}