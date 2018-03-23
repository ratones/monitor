import Controller from './controller';
import Router from './router';
//models
import VehiculModel from './models/vehicul';
import AtributModel from './models/atribut';
import AnvelopaModel from './models/anvelopa';
import CerereModel from './models/cerere';
//collections
import VehiculCollection from './collections/vehicule';
import AtributCollection from './collections/atribute';
import AnvelopaCollection from './collections/anvelope';

export default class Cereri extends Mn.Object{
	constructor(){
		super();
		this.controller = new Controller();
		this.router = new Router({controller:this.controller});
		this.router.onRoute = function(route, action, params) {
            var fragmens = params[0].split('/');
            app.trigger('app:request', {
                app: 'cereri',
                page: fragmens[0],
                params: fragmens[1]
            });
        };
		Backbone.associate(VehiculModel, {
		    Atribute: {
		        type: AtributCollection
		    },
		    Anvelope: {
		        type: AnvelopaCollection
		    }
		});
	}

}
