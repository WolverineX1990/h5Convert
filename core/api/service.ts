import fetch from 'node-fetch';
import { stringify } from 'querystring';
import CONFIG from './../const/CONFIG';

const { editServerHost, severHost } = CONFIG;

export function getViewData(sceneId: string, sceneCode: string, publishTime: string, cookie): Promise<any> {
	let url = `${CONFIG.eqxS1Host}eqs/s/page/${sceneId}?code=${sceneCode}&time=${publishTime}`;
	return fetch(url, { 
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
			Origin: 'http://h5.eqxiu.com',
			cookie
		}
	}).then(res => res.json());
}

export function createRabAlbum(data, headers) {
	return fetch(editServerHost + 'api/app', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: headers
	}).then(res => res.json());
}

export function getXsrf (headers) {
	return fetch(editServerHost + 'api/org/package', { 
		method: 'GET',
		headers: headers
	}).then(res => res.json());
}

export function saveRabAlbum(data, headers) {
	data['forceUpdate'] = false;
	let json = JSON.stringify(data);
	return fetch(editServerHost + 'api/app/' + data.id, { 
		method: 'PUT',
		body: json,
		headers: headers,
	}).then(res => res.json());
}

export function getUploadToken(type: string, isUserFile: Boolean, headers, files: string) {
	let data = {
		type,
		files,
		// count: 1,
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

export function saveApp(data, headers) {
	return fetch(severHost + 'api/workbench/marketing/myapp/saveApp', { 
		method: 'POST',
		body: JSON.stringify(data),
		headers: headers,
	}).then(res => res.json());
}