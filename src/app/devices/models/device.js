export default class DeviceModel extends Backbone.Model{
    constructor(options){
        super(options)
    }
    urlRoot() {
        return app.baseUrl + 'devices/edit';
    }
}