var AtributModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + '/vehicule/atribute';
    },
    defaults: {
        //val:''
    },
    fields: function() {
        var self = this;
        var notrequired = [28];
        return [{
            name: 'val',
            el: '#Atribute_' + self.get('index') + '__val',
            type: 'text',
            required: notrequired.indexOf(Number(self.get('id_nomenclator'))) < 0
        }];
    },
    initialize: function() {}
});
module.exports = AtributModel;
