import template from './../templates/campaign.html'

export default class CampaignView extends Marionette.View{
    constructor(options){
        super(options)
        this.template = template;
        this.tabs = []
        // this.listenTo(this.model,'change',(model)=>{console.log(model)})
        this.bindings={
            '#headingOne':{observe:'color',update:(el,value)=>{el.css({'background-color':value})}},
            '#state-dropdown':{observe:'status', update:(el,value)=>{el.text(value)}},
            '#header-link':{observe:'name', update:(el,value)=>{el.text(value)}}
        }
    }
    onAttach(){
        var self = this;
        this.$('.status-change' + this.model.id).click((e)=>{
            e.preventDefault()
            var status = $(e.target).text();
            $.bsAlert.confirm("Are you sure you want to change campaign status?",function(){
                self.$('#state-dropdown').text(status);
                // alert(1);
                self.model.set('status',status)
                self.model.save();
            });
        })
        this.$('.nav-link').click((e)=>{
            e.preventDefault();
        })
        this.$('.menu-change' + this.model.id).click((e)=>{
            e.preventDefault()
            var text = $(e.target).text();
            var action = $(e.target).data('action');
            self.addTab(action,text);
        })
        //create devices tab
        var devicesView = new app.Devices.DevicesView({devices:this.model.get('devices')});
        this.listenTo(devicesView,'device:show',this.showDevice.bind(this));
        this.$(`#pills-devices${this.model.id}`).html(devicesView.render().el)
        this.stickit()
    }


    addTab(action,text,model){
        var self = this;
        if(this.tabs.indexOf(action) != -1){
           var tab  = this.$(`#pills-${action}-tab${this.model.id}`);
           tab.tab('show');
            return;
        } 

            
        this.tabs.push(action);
        this.$('#pills-tabContent' + self.model.id).append(`<div class="tab-pane fade" id="pills-${action}${this.model.id}" role="tabpanel" aria-labelledby="pills-${action}${this.model.id}-tab"><div id="content-tab${action}${this.model.id}"></div></div>`)
        this.$('#campaign-tabs' + self.model.id).append(`<li class="nav-item" id="${action}-tab${this.model.id}">
                                        <a class="nav-link" id="pills-${action}-tab${this.model.id}" data-toggle="pill" href="#pills-${action}${this.model.id}" role="tab" aria-controls="pills-${action}${this.model.id}" aria-selected="false">${text}&nbsp;&nbsp;<i class="fa fa-times-circle" id="close-tab${action}"></i></a>
                                    </li>`)
       this.$('#close-tab'+action).click(self.removeTab.bind(self,action));
       
       if(action == 'editCampaign'){
           var el =  this.$(`#content-tab${action}${this.model.id}`)
           var view = new app.Campaigns.EditorView({model:this.model});
           el.append(view.render().$el)
        }
        if(action == 'settings'){
            var el =  this.$(`#content-tab${action}${this.model.id}`)
            var view = new app.Campaigns.SettingsView({parent_id:this.model.id,version:this.model.get('settings')});
            el.append(view.render().$el)
         }
         if(action.search('device') != -1){
            var el =  this.$(`#content-tab${action}${this.model.id}`)
            if(!model) {
                model = new app.Devices.DeviceModel();
                model.details={}
            }
            var view = new app.Devices.EditorView({model:model});
            el.append(view.render().$el)
         }
        this.$(`#pills-${action}-tab${this.model.id}`).tab('show');


    }

    removeTab(action){
        this.tabs.splice(this.tabs.indexOf(action),1);
        event.stopPropagation();
        event.preventDefault();
        this.$('#pills-tabContent' + this.model.id).find(`#pills-${action}${this.model.id}`).remove()
        this.$('#campaign-tabs' + this.model.id).find(`#${action}-tab${this.model.id}`).remove()
        console.log(action)
        this.activateNextTab()
    }

    activateNextTab(){
        var tab;
        if(this.tabs.length > 0){
            var tabid = this.tabs[this.tabs.length-1];
            tab = this.$(`#pills-${tabid}-tab${this.model.id}`)
        }
        else{
            tab = this.$(`#pills-devices-tab${this.model.id}`);
        }
        tab.tab('show');
    }

    showDevice(model){
        this.addTab(`device${model.id}`,model.get('name'),model);
    }
}