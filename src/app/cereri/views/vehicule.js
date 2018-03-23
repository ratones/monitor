import Config from './../config';
import Util from './../../util';
export default class VehiculeView extends Mn.View {
  constructor(options) {
    const props = $.extend(options||{},{

    });
    super(props);
    this.template = false;
    this.parentID = options.parentID;
    this.elid = options.element;
    this.canadd = options.canadd;
    self.caption = 'Lista vehicule atasate comenzii nr.' + self.parentID;
  }

  onRender(){
    this.renderGrid();
  }

  renderGrid(){
    var self = this;
    $(self.elid).w2grid(Config.vehicule.apply(self));
  }

  serializeData(){
    return {
        'id_comanda': this.parentID
    };
  }
  onBeforeDestroy() {
      w2ui['gridVehicule_' + this.parentID].destroy();
      if(this.win){
          event = {};
          //console.log(event);
          this.win.close();
      }
  }

  infoVehicul(id) {
      Util.printPDF(app.baseUrl + '/civfiles/GetVehiculComplet?id=' + id);
  }

  refreshGrid() {
      w2ui['gridVehicule' + this.parentID].reload();
  }
}
