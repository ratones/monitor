export default class CerereModel extends Backbone.SModel {
    constructor(props) {
        super(props);
    }
    fields() {
    	var self = this;
        return [{
            name: 'id',
            el: '#id',
            type: 'int'
        }, {
            name: 'data_comanda',
            el: '#data_comanda',
            type: 'date'
        }, {
            name: 'data_inreg',
            el: '#data_inreg',
            type: 'date',
            required: true
        }, {
            name: 'id_beneficiar',
            el: '#id_beneficiar',
            type: 'list',
            options:{
            	url:app.baseUrl + '/civutils/GetBeneficiari',
            	selected:self.get('id_beneficiar')
            },
            required: true
        }, {
            name: 'nr_inreg_soc',
            el: '#nr_inreg_soc',
            type: 'text',
            required: true
        }];
    }
    urlRoot() {
        return app.baseUrl + '/comenzi/edit';
    }
    addRelated(rel) {
        this.attributes.Vehicule.add(rel);
    }
    removeRelated(rel) {
        this.attributes.Vehicule.remove(rel);
    }
}
