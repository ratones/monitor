import SettingModel from './../models/settings'

export default class SettingsCollection extends Backbone.Collection{
    constructor(options){
        super(options);
        this.model = SettingModel
    }
}