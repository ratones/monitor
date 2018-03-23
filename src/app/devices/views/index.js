import DeviceView from './device'
import DevicesCollection from './../collections/devices'
import template from './../templates/index.html'

export default class DevicesView extends Marionette.CompositeView{
    constructor(options){
        super(options)
        this.childView = DeviceView;
        this.collection = new DevicesCollection();
        this.template = template;
        this.collection.reset(options.devices)
    }

    attachHtml(collectionView, itemView){
        collectionView.$('#devices-container').append(itemView.$el);
        itemView.$el.on('click',this.showDetails.bind(this,itemView.model))
    }
    showDetails(model){
        this.trigger('device:show',model);
    }
}