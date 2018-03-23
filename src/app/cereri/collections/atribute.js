var AtributModel = require('./../models/atribut'),
    AtributeCollection = window.Backbone.SCollection.extend({
        model: AtributModel,
        id_vehicul: undefined,

        initialize: function(models, options) {
            if (options !== undefined) {
                this.id_vehicul = options.id_vehicul;
            }

        },

        url: function() {
            return app.baseUrl + '/vehicule/getatributevehicul/' + this.id_vehicul;
        },

        byGroup: function(grupa) {
            filtered = this.filter(function(box) {
                return box.get('grupa') === grupa;
            });
            return new AtributeCollection(filtered);
        }

    });

module.exports = AtributeCollection;
