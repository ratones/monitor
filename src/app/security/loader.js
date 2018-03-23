import Controller from './controller';
import Router from './router';
import User from './models/user';
import Profile from './models/profile';
import LoginView from './views/login';
import ProfileView from './views/profile';
import Config from './config';

import Mn from 'backbone.marionette';

export default class Security extends Mn.Object {
  constructor() {
    super();
    this.Controller = new Controller();
    this.Router = new Router({controller:this.Controller});
    this.User = new User();
    this.Profile = Profile;
    this.LoginView = LoginView;
    this.ProfileView = ProfileView;
    this.Config = Config;
    this.baseUrl = app.Util.getBaseUrl(Config);
      // this.baseUrl = 'https://prog.rarom.ro:446/dotapi/';
    // this.checkSession();
  }
  checkSession(){
    var self = this;
    $.ajax({
        url: self.baseUrl + 'civaccount/checksession',
        success: (body) => {
            self.User.set(body).set('auth', true);
            self.User.trigger('user:login');
        },
        error: () => {
            self.User.set('displayname': 'Anonim').set('auth', false);
            self.User.trigger('user:login');
        }
    });
  }
}
