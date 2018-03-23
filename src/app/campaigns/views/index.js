import template from './../templates/index.html'
import CampaignsCollection from './../collections/campaigns'
import CampaignModel from './../models/campaign'
import CampaignView from './campaign'

export default class CampaignsView extends Mn.CompositeView{
    constructor(props){
        super(props);
        this.type = props.type;
        this.template = template;
        this.childView =  CampaignView;
        this.collection = new CampaignsCollection();
        this.listenTo(this.collection,'sync',this.render)
        //get campaigns based on type param
        $.get(app.baseUrl + 'campaigns/' + this.type, null, (response)=>{
           this.collection.reset(response);
        })
    }
    serializeData(){
        return {type:this.type};
    }
    attachHtml(collectionView, itemView){
        if(itemView.model.get('status').toUpperCase() == this.type.toUpperCase()){
            collectionView.$('#campaign-list').append(itemView.$el);
            // itemView.model.on('change',collectionView.render());
        }
    }
}