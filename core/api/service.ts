import fetch from 'node-fetch';
import { stringify } from 'querystring';
import { get } from './../request/index';
import CONFIG from './../const/CONFIG';

const { editServerHost, severHost } = CONFIG;

export function getViewData(sceneId: string, sceneCode: string, publishTime: string): Promise<any> {
	let url = `${CONFIG.eqxS1Host}eqs/page/${sceneId}?code=${sceneCode}&time=${publishTime}`;
	return get({url: url});
}

export function createRabAlbum(data, headers) {
	return fetch(editServerHost + 'api/app', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers,
	}).then(res=>{
		return res.json()
	});
}

export function saveRabAlbum(data, headers) {
	return fetch(editServerHost + 'api/app/' + data.appExtId, { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: headers,
	}).then(res=>{
		return res.json()
	});
}

export function getUploadToken(type: string, headers) {
	let data = {
		type,
		count: 1,
		needCallback: true,
		isUserFile: true,
		userfolder: -1
	};


	return fetch(editServerHost + 'api/upload/token?' + stringify(data), { 
		method: 'GET',
		headers,
	}).then(res=>{
		return res.json()
	});
}

export function uploadMusic(data, headers) {
	return fetch(editServerHost + 'api/upload/uploadedByUser', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers,
	}).then(res=>{
		return res.json()
	});
}

export function upload(data, headers) {
	return fetch(editServerHost + 'api/upload/uploaded', { 
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	}).then(res=>{
		return res.json()
	});
}

export function publishTpl(data, headers) {
	return fetch(editServerHost + 'api/app/publish/ ' + data.appExtId, { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: headers,
	}).then(res=>{
		return res.json()
	});
}