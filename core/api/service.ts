import fetch from 'node-fetch';
import { stringify } from 'querystring';
import CONFIG from './../const/CONFIG';

const { editServerHost, severHost } = CONFIG;

export function getViewData(sceneId: string, sceneCode: string, publishTime: string): Promise<any> {
	let url = `${CONFIG.eqxS1Host}eqs/page/${sceneId}?code=${sceneCode}&time=${publishTime}`;
	return fetch(url, { 
		method: 'GET'
	}).then(res => res.json());
}

export function createRabAlbum(data, headers) {
	return fetch(editServerHost + 'api/app', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers,
	}).then(res => res.json());
}

export function saveRabAlbum(data, headers) {
	let json = JSON.stringify(data);
	// console.log('len:'+json.length);
	return fetch(editServerHost + 'api/app/' + data.id, { 
		method: 'PUT',
		body: json,
		headers: headers,
	}).then(res => res.json());
}

export function getUploadToken(type: string, isUserFile: Boolean, headers) {
	let data = {
		type,
		count: 1,
		needCallback: true,
		isUserFile: isUserFile,
		userfolder: -1
	};


	return fetch(editServerHost + 'api/upload/token?' + stringify(data), { 
		method: 'GET',
		headers,
	}).then(res => res.json());
}

export function uploadMusic(data, headers) {
	return fetch(editServerHost + 'api/upload/uploadedByUser', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers,
	}).then(res => res.json());
}

export function upload(data, headers) {
	return fetch(editServerHost + 'api/upload/uploaded', { 
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	}).then(res => res.json());
}

export function publishTpl(data, headers) {
	return fetch(editServerHost + 'api/app/publish/ ' + data.id, { 
		method: 'PUT',
		body: JSON.stringify(data),
		headers: headers,
	}).then(res => res.json());
}