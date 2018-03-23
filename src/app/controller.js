import RootView from './main/views/root';
// import LoginView from './main/views/login';
import HomeView from './main/views/home';
// import ProfileView from './main/views/profile';
// import InfoView from './main/views/info';
// import SettingsView from './main/views/settings';

export default class Controller {
    constructor() {}

    start() {
        // $.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
        //     format: 'DD.MM.YYYY'
        //   });
        var root = new RootView();
        app.showView(root);
    }

    home() {
        app.getView().showChildView('container',new HomeView());
    }



    settings() {
      var View = new SettingsView();
      // View.showModal();
      app.getView().showChildView('modal',View,{preventDestroy:true});
      // app.getView().showChildView('modal',View);
    }

    info() {
        var View = new InfoView();
        View.show();
    }
    reload(){
      //Proxy.getServer().close(function(){
        
      //});
      //process.nextTick(function(){Proxy.getServer().emit('close')});
    }
    quit(){
     
    }
};
