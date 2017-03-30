'use strict';
var utils = require('./../utils');
var insertScenePage = require('./insertScenePage');
var compTypes = {
	'image': 4,
	'text': 2
};
/**
 * 兔展场景
 */
class Rabbitpre {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	toScene(scene) {
		scene.propertys = {
			name: this.data.name,
			description: this.data.desc
		};
		var page = this.pages.shift();
		// var page = this.pages[0];
		// this.pages = [];
		console.log('page:'+this.pages.length);
		if(page) {
			return insertScenePage(scene, page).then(res=> this.toScene(scene));	
		} else {
			return setSceneMeta(this.data, scene);
		}
	}

	toMaka() {

	}

	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	loadSuc(res) {
		if(res.indexOf('Moved Temporarily') > -1) {
	        var reg = /Moved Temporarily. Redirecting to[\s]*([\w|\s|\W]+)/;
	        utils.getHtml(res.match(reg)[1]).then(res=>this.loadSuc(res));
	    } else {
	    	var dataReg = /var[\s|\w]*pageData[\s|\w]*=[\s|\w]*{([\s|\w|\W]+)/;
	        return utils.getPageData(res, dataReg).then(res => {
	        	this.data = JSON.parse(res);
	        	this.pages = this.data.pages;
	        	return res;
	        }, error=>console.log(error));
	    }
	}
}

module.exports = Rabbitpre;

function setSceneMeta(data, scene) {
	console.log(1);
	if(data.imgurl){
		console.log(2);
		return scene.uploadImg(data.imgPath).then(res=> {
			console.log(3);
			var key = JSON.parse(res).key;
			scene.propertys = {
				cover: key
			};
			if(data.musicPath) {
				return scene.uploadAudio(data.musicPath).then(res1=>{
					console.log(4);
					var key = JSON.parse(res1).key;
					scene.propertys = {
						bgAudio: JSON.stringify({
							name: data.musicname,
							url: key
						})
					};
				 	return scene.publish();
				});
			} else {
				return scene.publish();
			}
		});
	} else if(data.musicPath) {
		return scene.uploadAudio(data.musicPath).then(res1=>{
			scene.propertys = {
				bgAudio: {
					name: data.musicname,
					url: key
				}
			};
		 	return scene.publish();
		});
	} else {
		return scene.publish();
	}
}