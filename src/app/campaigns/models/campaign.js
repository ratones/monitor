export default class CampaignModel extends Backbone.Model{
    constructor(options){
        super(options);
    }
    urlRoot() {
        return app.baseUrl + 'campaigns/edit';
    }
}
