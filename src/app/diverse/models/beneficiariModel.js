export default class BeneficiariModel extends Backbone.SModel {
    constructor(props) {
        super(props);
    }

    urlRoot() {
        return app.Diverse.baseUrl + 'beneficiari/edit';
    }


    fields() {
        var self = this;
        return [{
            name: 'denumire_beneficiar',
            el: '#denumire_beneficiar',
            type: 'text',
            required: true
        }, {
            name: 'adresa2',
            el: '#adresa2',
            type: 'text',
            required: true
        }, {
            name: 'telefon',
            el: '#telefon',
            type: 'text',
            required: true
        }, {
            name: 'fax',
            el: '#fax',
            type: 'text',
            required: true
        }, {
            name: 'email',
            el: '#email',
            type: 'text',
            required: true
        }, {
            name: 'reprezentant',
            el: '#reprezentant',
            type: 'text',
            required: true
        }, {
            name: 'reprezentant_legal',
            el: '#reprezentant_legal',
            type: 'text',
            required: true
        }, {
            name: 'calitate',
            el: '#calitate',
            type: 'text',
            required: true
        }, {
            name: 'nr_registru_comertului',
            el: '#nr_registru_comertului',
            type: 'text',
            required: true
        }, {
            name: 'atribut_fiscal',
            el: '#atribut_fiscal',
            type: 'text',
            required: true
        }, {
            name: 'cod_fiscal',
            el: '#cod_fiscal',
            type: 'text',
            required: true
        }, {
            name: 'cont',
            el: '#cont',
            type: 'text',
            required: true
        }, {
            name: 'banca',
            el: '#banca',
            type: 'text',
            required: true
        }];
    }
}
