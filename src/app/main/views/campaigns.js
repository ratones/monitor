import template from './../templates/campaigns.html';

export default class CampaingsCard extends Marionette.View{
    constructor(){
        super()
        this.template = template;
    }
}