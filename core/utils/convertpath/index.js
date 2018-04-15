"use strict";

const fs = require("fs");
const path = require("path");
const xmldom = require("xmldom");
const DOMParser = xmldom.DOMParser;  //解析为文档对象
const XMLSerializer = xmldom.XMLSerializer;  //XML序列化
const convertShapeToPath = require("./convert").fn;
// var Doc //声明文档流对象 

/**
 * [toSimpleSvg svg基本图形转换path]
 * @return {[type]} [description]
 */
function toSimpleSvg(str){
	//console.info(Doc.documentElement)	
	var Doc = new DOMParser().parseFromString(str, 'application/xml');
	var slice = Array.prototype.slice;

	//递归转换
	function transNode(node, Doc){

		//基本的图形都不含有子结点
		if (!node.hasChildNodes() && node.nodeName !== 'path') {
			convertShapeToPath(node, Doc)
		} else if (node.hasChildNodes()) {
			slice.call(node.childNodes).forEach( function(item){
				transNode(item, Doc)
			} )
		}
	}

	slice.call(Doc.documentElement.childNodes).forEach(function(node){
		transNode(node, Doc)
	})

	//console.log("XMLSerializer", new XMLSerializer().serializeToString(Doc))
	return new XMLSerializer().serializeToString(Doc)
}

/*
 * [writeToFile description]
 * @param  {[type]} data [数组数据列表]
 * @param  {[type]} path [写入的路径]
 */
 function writeToFile(data,path,calllback){
 	var data = JSON.stringify(data,null, "\t");
 	fs.writeFile(path,data,"utf-8",function(err){
 		if(err) throw err;
 		calllback && calllback();
 	});
 }

module.exports = toSimpleSvg;
