import VehiculModel from './../models/vehicul';
export default class VehiculeCollection extends Backbone.SCollection {
  constructor(options) {
    super(options);
    this.model = VehiculModel;
  }
  meta(prop, value) {
      if (value === undefined) {
          return this._meta[prop];
      } else {
          this._meta[prop] = value;
      }
  }
  url() {
      var url = app.baseUrl + '/vehicule/getvehicule';
      if (this.id_comanda) {
          url += '/' + this.id_comanda;
      }
      return url;
  }
  initialize(models, options) {
      //this.listenTo(this,'destroy',function(model){});
      if (options) {
          if (options.fk) {
              this.id_comanda = (options.fk);
          }
      }
      this._meta = {};

  }
  parse(response) {
      this.meta('totalSize', response.iTotalRecords);
      this.meta('filteredSize', response.iTotalDisplayRecords);
      return response.aaData;
  }
  setFilter(filter) {
      this.url = app.baseUrl +  'vehicule/getVehicule/' + this.id_comanda;
      this.url = this.url + '?' + filter;
  }

  addFilter(filter) {
      this.url = app.baseUrl + this.url + filter;
  }

}
