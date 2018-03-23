import IndexView from './views/index';
import PlatiView from './views/plati';
import EditorView from './views/editor';
import VehiculeView from './views/vehicule';
import CerereModel from './models/cerere';
import VehiculModel from './models/vehicul';
import Coll from './collections/vehicule';
import NAnvelopeCollection from './collections/nanvelope';
// import  from './collections/vehicule';
import ArhivareView from './views/arhivare';
import VehiculView from './views/vehicul';
import SpreadsheetView from './views/spreadsheet';
import SfarsitSerieView from './views/sfarsitSerie';

import AtributeAccordionView from './views/atribute';
import AnvelopeAccordionView from './views/anvelope';

import Globals from './globals';
import Util from './../util';
export default class CereriController extends Mn.Object {
    constructor() {
        super();
    }
    request(route) {
        var segments = route.split('/');
        var method = segments[0];
        var args = segments.length > 1 ? segments.splice(1, 1) : null;
        this[method].apply(this, args);
        app.trigger('app:set:title',method);
        console.info('Route requested on Cereri controller');
    }
    cereri() {
        let view = new IndexView();
        app.getView().showChildView('container', view);
    }
    plati() {
        let view = new PlatiView();
        app.getView().showChildView('container', view);
    }

    editCerere(id) {
        let view = new EditorView({
            model: new CerereModel({
                id: id
            })
        });
        view.show();
    }

    detaliiPlataCerere(argument) {
        Util.printPDF(app.baseUrl + '/civfiles/getplatacomanda/?id=' + argument);
    }

    arhivareComanda(id) {
        $.get(app.baseUrl + '/vehicule/getvehiculecomanda/' + id, function(data) {
            var view = new ArhivareView({
                data: data
            });
            view.show();
        });
    }

    anulareComanda(id,callback){
      w2confirm('Sigur doriti anularea comenzii?').yes(function(){
        $.post(app.baseUrl + '/comenzi/anulare/'+id,function(){
          callback();
        });
      })
    }

		listVehicule(gridRowid, options) {
        var elem = '#' + gridRowid;
        var mainView = new VehiculeView({
            element: elem,
            parentID: options.pid,
            canadd: options.canadd,
            totalItems:options.totalVehicule
        });
        mainView.render();
    }

		spreadsheetVehicule(id){
        app.getView().showChildView('container',new SpreadsheetView({id_comanda:id}));
    }

    detaliiVehicul(id) {
        var m = new VehiculModel({
            id: id
        });
        m.fetch().then(function() {
            $.get(app.baseUrl + '/vehicule/getRelatedVehicles/'+m.get('id_comanda'),null, function(ids){
                app.getView().showChildView('container',new VehiculView({
                    model: m,
                    relatedVehicles:ids
                }));
            });
        });
    }

    addVehicul(id_comanda) {
        var m = new VehiculModel({
            id_comanda: id_comanda
        });
      app.getView().showChildView('container',new VehiculView({
            model: m
        }));
    }

    renderAtributes(argument) {
        var atrView = new AtributeAccordionView({
            collection: argument.atributes
        });
        $(argument.element).html(atrView.render().el);
    }

    renderAnvelope(argument) {
        var anvView = new AnvelopeAccordionView({
            collection: argument.anvelope
        });
        var el = anvView.render().el;
        $(argument.element).html(el);
        app.Cereri.trigger('anvelopeView:setSelect');
    }

    loadListeAnvelope(model, callback) {
        var self = this;
        $.ajax({
            url: app.baseUrl + '/vehicule/GetListaAvelope',
            data: {
                id_tvv: model.get('id_tvv'),
                id_extensie: model.get('id_extensie')
            },
            success: function(response) {
                //source = response;
                var n_anv_fata = new NAnvelopeCollection(response.anvelopef),
                    n_anv_spate = new NAnvelopeCollection(response.anvelopes);

                Globals.setAnvelopeFata(n_anv_fata);
                Globals.setAnvelopeSpate(n_anv_spate);

                //dezactivam optiunile existente, pentru a nu mai putea fi alese
                // var existingf = _.pluck(model.get('Anvelope').undeleted().toJSON(), 'id_roataf');
                // var availablef = _.pluck(n_anv_fata.toJSON(), 'id');
                // var todisable = _.intersection(existingf, availablef);
                // for (var id in todisable) {
                //     Globals.anvelopefata.get(todisable[id]).set('disabled', true);
                // }
                // var existings = _.pluck(model.get('Anvelope').undeleted().toJSON(), 'id_roatas');
                // var availables = _.pluck(n_anv_spate.toJSON(), 'id');
                // var todisables = _.intersection(existings, availables);
                // for (var x in todisables) {
                //     Globals.anvelopespate.get(todisables[x]).set('disabled', true);
                // }
                if (callback) {
                    callback();
                }
            }
        });
    }

    sfarsitSerie() {
        app.getView().showChildView('container',new SfarsitSerieView({
            message: 'Hello new module!'
        }));
    }

    transmitComanda(id,callback){
        $.ajax({
            type:'POST',
            url:app.baseUrl+'/comenzi/processcomanda/'+id,
            success:function(response){
                callback();
            },
            error:function(response){
                callback();
            }
        });
    }


}
