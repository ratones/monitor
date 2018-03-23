import Globals from './../globals';
var AnvelopaModel = window.Backbone.SModel.extend({
    urlRoot: function() {
        return app.baseUrl + '/vehicule/anvelope';
    },
    defaults: {},
    fields: function() {
        var self = this;
        return [{
            el: '#Anvelope_' + self.get('index') + '__id_roataf',
            name: 'id_roataf',
            required: Globals.anvelopefata.models.length > 0,
            type:'int'
        }, {
            el: '#Anvelope_' + self.get('index') + '__id_roatas',
            name: 'id_roatas',
            required: Globals.anvelopespate.models.length > 0,
            type:'int'
        }];
    }
});
module.exports = AnvelopaModel;
