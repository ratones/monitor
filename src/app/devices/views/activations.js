import Template from './../templates/activationtable.html'
import ActivationRow from './activation'

export default class ActivationTable extends Marionette.CompositeView{
    constructor(options){
        
        super(options)
        this.template = Template;
        this.childView = ActivationRow
        this.collection = new Backbone.Collection(options.data)
    }
    attachHtml(collectionView,itemView){
        collectionView.$('tbody').append(itemView.$el);
    }
    onRender(){
        
    }
}