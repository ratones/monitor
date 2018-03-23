export default class Router extends Mn.AppRouter {
    constructor(options) {
      var local = $.extend(options, {
        appRoutes:{
          'devices/*action':'request'
        }
      });
      super(local);
    }
  }