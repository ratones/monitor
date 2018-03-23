import Template from './../templates/editor.html';
import ActivationsTable from './activations';

export default class DeviceEditor extends Marionette.View{
    constructor(options){
        super(options);
        this.template = Template;
        this.bindings={};
        this.applyBindings()
    }
    applyBindings(){
        for (var prop in this.model.attributes) {
            this.bindings[`#${prop}`] = prop;
        }
        this.bindings['#battery'] = {
            observe:'details',
            onGet:(value)=>{
                if (value) return value.battery;
                return '';
            }
        }
        this.bindings['#product'] = {
            observe:'details',
            onGet:(value)=>{
                if (value) return value.product;
                return '';
            }
        }
        this.bindings['#sound'] = {
            observe:'details',
            onGet:(value)=>{
                if (value) return value.sound;
                return '';
            }
        }
        this.bindings['#mechanism'] = {
            observe:'details',
            onGet:(value)=>{
                if (value) return value.mechanism;
                return '';
            }
        }
        this.bindings['#activations'] = {
            observe:'details',
            onGet:(value)=>{
                if (value) return value.activations;
                return '';
            }
        }
        this.bindings['#updated'] = {
            observe:'details',
            onGet:(value)=>{
                if (value) return  moment(value.updated).format('DD.MM.YYYY HH:mm:ss');;
                return '';
            }
        }
        this.bindings['.hide-new'] = {
            observe: 'id',
            visible:(val,opts)=>{return val != false}
        }
    }

    onRender(){
        var self = this;
        this.buildCampaigns().then(()=>{
            self.stickit()
        })
        var activations = new ActivationsTable({data:this.model.get('activations_files')});
        this.$('#table-activations').html(activations.render().el);
        this.$('#dataTable').DataTable()
    }

    buildCampaigns(){
        var self = this;
        return new Promise((resolve)=>{
            $.get(app.baseUrl + 'campaigns/index').then((resp)=>{
                $.each(resp,(i,campaign)=>{
                    self.$('#campaign_id').append(`<option value="${campaign.id}">${campaign.name}</option>`);
                });
                resolve();
            });
        });
    }
}