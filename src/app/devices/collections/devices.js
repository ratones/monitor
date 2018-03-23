import DeviceModel from './../models/device'

export default class DevicesCollection extends Backbone.Collection{
    constructor(options){
        super(options);
        this.model = DeviceModel
    }
}