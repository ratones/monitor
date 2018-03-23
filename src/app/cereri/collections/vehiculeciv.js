// import VehiculCIVModel from './../models/vehiculciv';
// export default class VehiculeCIVCollection extends Backbone.Collection{
//   constructor(options){
//     const local = $.extend(options,{
//       model:VehiculCIVModel
//     });
//     super(local);
//     // this.model = VehiculCIVModel;
//   }
// }
var ModelCIV = require('./../models/vehiculciv');
module.exports = Backbone.Collection.extend({
	model:ModelCIV
});
