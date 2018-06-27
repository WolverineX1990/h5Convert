import RabbitUser from './core/user/RabbitUser';
import CONFIG from './core/const/CONFIG';
import Scene from './core/Album/Scene';
import Rabbit from './core/Album/Rabbit';

let eqxUrl:string = 'http://h5.eqxiu.com/s/88lFEvLI';
let user: RabbitUser = new RabbitUser(CONFIG.userName, CONFIG.userPwd);
let scene: Scene = new Scene(eqxUrl);
let promise = Promise.all([scene.loadData(), user.login()]);

promise.then(() => {
    let rabbit: Rabbit = new Rabbit();
    rabbit.user = user;
    return rabbit.createAlbum();
  })
  .then(rabbit => scene.toRabbit(rabbit))
  .then(res => console.log(res));