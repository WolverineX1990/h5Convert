import User from './User';
import fetch from 'node-fetch';
import CONFIG from './../const/CONFIG';
import log from './../decorators/log';

@log
class RabbitUser extends User {
	cookie: Array<Object>;
	info: Object;
	constructor(name, pwd) {
		super(name, pwd);
		this.loginUrl = CONFIG.loginUrl;
	}

  login() {
    let body = {
			account: this.name,
			password: this.pwd
		};

		return fetch(this.loginUrl, { 
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => {
			this.cookie = [res.headers.get('set-cookie')];
			return res.json();
		})
		.then(json => {
			if (json.code !== '200') {
				throw new Error(json.msg);
			}
			return this.info = json.data;
		})
		.then(() => fetch(CONFIG.severHost + 'api/home/user', {
			headers: {
				Cookie: this.cookie.join('; ')
			},
		}))
		.then(res => {
			this.cookie.push(res.headers.get('set-cookie'));
			return res.json();
		});
  }
}
export default RabbitUser;