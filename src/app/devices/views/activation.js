import Template from './../templates/activationrow.html'

export default class ActivationRow extends Marionette.View{
    constructor(options){
        var props = $.extend({
            tagName:'tr'
        },options);
        super(props)
        this.template = Template;
    }
}