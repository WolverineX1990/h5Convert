class User {
  name: string;
  pwd: string;
  loginUrl: string;
  constructor(name: string, pwd: string) {
		this.name = name;
		this.pwd = pwd;
  }
}

export default User;