import Config from './config';
import Controller from './controller';
import Router from './router';
import IntrareModel from './models/intrare';
import IesireModel from './models/iesire';
import ListaIntrariView from './views/listaintrari';
import ListaIesiriView from './views/listaIesiri';
import IntrareView from './views/editintrare';
import IesireView from './views/editiesire';
export default class Secretariat extends Mn.Object {
  constructor() {
    super();
    this.Config = Config;
    this.Controller = new Controller();
    this.Router = new Router({controller:this.Controller});
		// this.Router.onRoute = function(route, action, params) {
    //         var fragmens = params[0].split('/');
    //         app.trigger('app:request', {
    //             app: 'cereri',
    //             page: fragmens[0],
    //             params: fragmens[1]
    //         });
    //     };
    this.baseUrl = app.Util.getBaseUrl(Config);
    // this.baseUrl = 'https://prog.rarom.ro:446/dotapi/';
    this.IntrareModel = IntrareModel;
    this.IesireModel = IesireModel;
    this.ListaIntrariView = ListaIntrariView;
    this.ListaIesiriView = ListaIesiriView;
    this.IntrareView = IntrareView;
    this.IesireView = IesireView;
  }
}
