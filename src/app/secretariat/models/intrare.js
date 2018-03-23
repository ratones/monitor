export default class IntrariModel extends Backbone.SModel {
    constructor(props) {
        var options = $.extend(props, {});
        super(options);
        this.defaults = {
            intrare: 1
        };
    }

    urlRoot() {
        return app.Secretariat.baseUrl + 'registru/intrare';
    }

    fields() {
        var self = this;
        return [{
            name: 'nr_inregistrare',
            el: '#nr_inregistrare',
            type: 'text'
        }, {
            name: 'data_inreg',
            el: '#data_inreg',
            type: 'date',
            required: true
        }, {
            name: 'nr_doc',
            el: '#nr_doc',
            type: 'text',
            required: true
        }, {
            name: 'data_doc',
            el: '#data_doc',
            type: 'date',
            required: true
        }, {
            name: 'nr_cerere_client',
            el: '#nr_cerere_client',
            type: 'text'
        }, {
            name: 'data_cerere_client',
            el: '#data_cerere_client',
            type: 'date'
        }, {
            name: 'provenienta',
            el: '#provenienta',
            type: 'combo',
            options: {
                minLength: 0,
                url: app.Secretariat.baseUrl + 'utils/GetProveniente',
                selected: self.get('provenienta')
            },
            required: true
        }, {
            name: 'repartizare',
            el: '#repartizare',
            type: 'text'
        }, {
            name: 'continut',
            el: '#continut',
            type: 'text'
        }, {
            name: 'tip',
            el: '[name="tip"]',
            type: 'radio',
            required: true
        }];
    }
}
