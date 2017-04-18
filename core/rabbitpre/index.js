'use strict';
var utils = require('./../utils');
var insertScenePage = require('./insertScenePage');
var compTypes = {
	'image': 4,
	'text': 2
};
/**
 * 兔展场景对象
 */
class Rabbitpre {
	constructor(data) {
		if(typeof data == 'string') {
			this.dataUrl = data;
		} else {
			this.data = data;
		}
	}

	/**
	 * [toScene 转易企秀]
	 * @param  {[type]} scene [description]
	 * @return {[type]}       [description]
	 */
	toScene(scene) {
		scene.propertys = {
			name: this.data.name,
			description: this.data.desc
		};
		var page = this.pages.shift();
		console.log('page:'+this.pages.length);
		if(page) {
			return insertScenePage(scene, page).then(res=> this.toScene(scene));	
		} else {
			return setEqxMeta(this.data, scene);
		}
	}

	toMaka() {

	}

	/**
	 * [loadData 加载url中数据]
	 * @return {[type]} [description]
	 */
	loadData() {
		return utils.getHtml(this.dataUrl).then(res=>this.loadSuc(res));
	}

	/**
	 * [loadSuc loadData的回调处理]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	loadSuc(res) {
		if(res.indexOf('Moved Temporarily') > -1) {
	        var reg = /Moved Temporarily. Redirecting to[\s]*([\w|\s|\W]+)/;
	        return utils.getHtml(res.match(reg)[1]).then(res=>this.loadSuc(res));
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

/**
 * [setEqxMeta 设置易企秀场景属性]
 * @param {[type]} data  [description]
 * @param {[type]} scene [description]
 */
function setEqxMeta(data, scene) {
	if(data.imgurl){
		return scene.uploadImg({
			type: 'image',
			url: data.imgPath
		}).then(res=> {
			var key = JSON.parse(res).key;
			scene.propertys = {
				cover: key
			};
			if(data.musicPath) {
				return scene.uploadAudio(data.musicPath).then(res1=>{
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