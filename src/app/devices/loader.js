import Controller from './controller';
import Router from './router';
import DevicesView from './views/index';
import EditorView from './views/editor';
import DeviceModel from './models/device';

export default class Devices extends Mn.Object{
  constructor(){
    super();

    this.Controller = new Controller();
    this.Router = new Router({controller: this.Controller});

    this.baseUrl = 'http://www.monitor.tokinomo.com/index.php/api/';//app.Util.getBaseUrl(Config);

    this.DevicesView = DevicesView;
    this.EditorView = EditorView;
    this.DeviceModel = DeviceModel;
  }
}