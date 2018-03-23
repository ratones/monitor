import CampaignModel from './../models/campaign'

export default class CampaignsCollection extends Backbone.Collection{
    constructor(options){
        super(options);
        this.model = CampaignModel
    }
}