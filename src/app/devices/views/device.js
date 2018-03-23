import template from './../templates/device.html'

export default class DeviceView extends Marionette.View{
    constructor(options){
        var props = $.extend({
            className:'device-img'
        },
        options)
        super(props);
        this.template = template;
    }
    onRender(){
        
    }
    
}