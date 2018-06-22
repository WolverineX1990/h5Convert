'use strict';
var Db = require('./db');
// var db = new Db('db4free.net', 'h5converzcj', 'h5conver', 'h5conver');

function checkExist(id, type) {
	var sql = `select * from conver_scene where scene_id='${id}' and type = ${type}`;
	return db.execute(sql).then(res=>{
        if(res.length) {
            throw new Error(id + ':' + res[0].url + ' exist');
        }
        return false;
    });
}

function insert(id, type, url) {
	var sql = `insert into conver_scene(scene_id, type, url) values('${id}', ${type}, '${url}')`;
	return db.execute(sql);
}

function del(id) {
	var sql = `delete from conver_scene where scene_id='${id}'`;
	return db.execute(sql);
}

function close() {
	return db.destory();
}

module.exports = {
	checkExist: checkExist,
	insert: insert,
	del: del,
	close: close
};