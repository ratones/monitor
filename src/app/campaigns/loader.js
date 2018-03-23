// import Config from './config';
import Controller from './controller';
import Router from './router';
// import BeneficiariModel from './models/beneficiariModel';
// import EditBeneficiariView from './views/editBeneficiari';
import CampaignsView from './views/index';
import EditorView from './views/editor';
import SettingsView from './views/settings';
// import ActeNormativeView from './views/acteNormative';
// import PrescriptiiView from './views/prescriptii';
export default class Campaigns extends Mn.Object{
  constructor(){
    super();

    // this.Config = Config;
    this.Controller = new Controller();
    this.Router = new Router({controller: this.Controller});

    this.baseUrl = 'http://www.monitor.tokinomo.com/index.php/api/';//app.Util.getBaseUrl(Config);

    // this.BeneficiariModel = BeneficiariModel;
    this.CampaignsView = CampaignsView;
    this.EditorView = EditorView;
    this.SettingsView = SettingsView;
    // this.ProducatoriView = ProducatoriView;
    // this.ActeNormativeView = ActeNormativeView;
    // this.PrescriptiiView = PrescriptiiView;
  }
}