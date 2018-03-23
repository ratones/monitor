// export default class VehiculCIVModel extends Backbone.Model{
//   constructor(options){
//     if(!options) options = {};
//     const local = $.extend(options,{
//       idAttribute:'nr_identif'
//     });
//     super(local);
//   }
// }
module.exports = Backbone.Model.extend({
	idAttribute:'nr_identif'
});
