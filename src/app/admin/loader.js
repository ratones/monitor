import Controller from './controller';
import Router from './router';
import UsersView from './views/utilizatoriView';
import RolesView from './views/roluriView';
import Config from './config';
export default class Admin extends Mn.Object {
  constructor() {
    super();
    this.Controller = new Controller();
    this.Router = new Router({controller:this.Controller});

    this.UsersView = UsersView;
    this.RolesView = RolesView;
    this.Config = Config;
    this.baseUrl = app.Util.getBaseUrl(Config);
      // this.baseUrl = 'https://prog.rarom.ro:446/dotapi/';
  }
}
