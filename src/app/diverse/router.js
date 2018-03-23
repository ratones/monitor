export default class Router extends Mn.AppRouter {
    constructor(options) {
      var local = $.extend(options, {
        appRoutes:{
          'diverse/*action':'request'
        }
      });
      super(local);
    }
  }
