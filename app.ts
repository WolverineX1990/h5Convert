import RabbitUser from './core/user/RabbitUser';
import CONFIG from './core/const/CONFIG';
import Scene from './core/Album/Scene';
import Rabbit from './core/Album/Rabbit';

//http://h5.eqxiu.com/s/88lFEvLI
let eqxUrl:string = 'http://h5.eqxiu.com/s/gxYe9uUU';

async function main() {
  let user: RabbitUser = new RabbitUser(CONFIG.userName, CONFIG.userPwd);
  let scene: Scene = new Scene(eqxUrl);
  await scene.loadData();
  await user.login();

  let rabbit: Rabbit = new Rabbit();
  rabbit.user = user;
  
  await rabbit.getCsrfToken();
  await rabbit.createAlbum();
  await scene.toRabbit(rabbit);
  console.log('success');
}

main();