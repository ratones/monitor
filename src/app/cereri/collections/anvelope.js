 var AnvelopaModel = require('./../models/anvelopa'),
     AnvelopeCollection = window.Backbone.SCollection.extend({
         model: AnvelopaModel,
         id_vehicul: undefined,
         initialize: function(models, options) {
             if (options !== undefined) {
                 this.id_vehicul = options.id_vehicul;
             }
         },
         url: function() {
             return app.baseUrl + '/vehicule/getanvelopevehicul/' + this.id_vehicul;
         },

         byEchipare: function(echip) {
             var filtered = this.filter(function(anvelopa) {
                 return anvelopa.get('echip') === 1;
             });
             return new AnvelopeCollection(filtered);
         },
         undeleted: function() {
             var filtered = this.filter(function(anvelopa) {
                 return anvelopa.get('EntityState') !== 2;
             });
             return new AnvelopeCollection(filtered);
         }
     });
 module.exports = AnvelopeCollection;
