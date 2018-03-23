import Mn from 'backbone.marionette';
export default class InfoView extends Mn.View{
   constructor(){
     super();
     this.template = require('./../templates/info.html');
   }

    serializeData() {
    }

    show(){
    }
}
