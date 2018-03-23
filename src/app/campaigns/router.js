export default class Router extends Mn.AppRouter {
    constructor(options) {
      var local = $.extend(options, {
        appRoutes:{
          'campaigns/*action':'request'
        }
      });
      super(local);
    }
  }