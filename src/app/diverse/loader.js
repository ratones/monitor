import Config from './config';
import Controller from './controller';
import Router from './router';
import BeneficiariModel from './models/beneficiariModel';
import EditBeneficiariView from './views/editBeneficiari';
import BeneficiariView from './views/beneficiari';
import ProducatoriView from './views/producatori';
import ActeNormativeView from './views/acteNormative';
import PrescriptiiView from './views/prescriptii';
export default class Diverse extends Mn.Object{
  constructor(){
    super();

    this.Config = Config;
    this.Controller = new Controller();
    this.Router = new Router({controller: this.Controller});

    this.baseUrl = app.Util.getBaseUrl(Config);

    this.BeneficiariModel = BeneficiariModel;
    this.EditBeneficiariView = EditBeneficiariView;
    this.BeneficiariView = BeneficiariView;
    this.ProducatoriView = ProducatoriView;
    this.ActeNormativeView = ActeNormativeView;
    this.PrescriptiiView = PrescriptiiView;
  }
}
