import Mn from 'backbone.marionette';

export default class Controller extends Mn.Object {
  constructor() {
    super();
  }
  request(route) {
      var segments = route.split('/');
      var method = segments[0];
      var args = segments.length > 1 ? segments.splice(1, 1) : null;
      this[method].apply(this, args);
      app.trigger('app:set:title',method);
      console.info('Route requested on Security controller');
  }
  login() {
      const loginView = new app.Security.LoginView();
      //a promise for whom ever is interested
      app.getView().showChildView('modal',loginView);
      return loginView.promise();
  }

  logoff(e) {
      app.Security.User.logoff();
  }
  profile() {
      app.getView().showChildView(app.Security.Config.mainElementID,new app.Security.ProfileView());
  }
  handleUnauthorized() {
      return this.login();
  }
}
