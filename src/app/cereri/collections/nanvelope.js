 var NAnvelopaModel = require('./../models/nanvelopa'),
     NAnvelopeCollection = window.Backbone.SCollection.extend({
         model: NAnvelopaModel,
         initialize: function(models, options) {},
         url: function() {},
         active: function() {
             var filtered = this.filter(function(anvelopa) {
                 return anvelopa.get('disabled') !== true;
             });
             return new NAnvelopeCollection(filtered);
         }
     });
 module.exports = NAnvelopeCollection;
