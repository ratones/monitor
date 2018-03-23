import Promise from 'promise-polyfill';
import template from './../templates/editor.html'
import Countries from './../../countries';

export default class CampaignEditor extends Marionette.View {
    constructor(options) {
        var props = $.extend(options, {
            events: {
                'click #btnSave':'save'
            }
        });
        super(props)
        this.template = template;
        this.bindings = {};
        this.applyBindings()
    }
    applyBindings() {
        for (var prop in this.model.attributes) {
            this.bindings[`#${prop}`] = prop;
        }
        this.bindings['#color-preview'] = { observe: 'color', update: (el, value) => { el.css({ 'background-color': value }) } }
        this.bindings['#start_date'] = {
            observe: 'start_date',
            onGet: (value) => {
                return moment(value).format('DD.MM.YYYY')
            },
            onSet: (value) => {
                return moment(value, 'DD.MM.YYYY');
            }
        }
        this.bindings['#end_date'] = {
            observe: 'end_date',
            onGet: (value) => {
                return moment(value).format('DD.MM.YYYY')
            },
            onSet: (value) => {
                return moment(value, 'DD.MM.YYYY');
            }
        }
        // this.model.set('start_date',moment(this.model.get('start_date')).format('DD.MM.YYYY'),{silent:true});
        // this.model.set('end_date',moment(this.model.get('end_date')).format('DD.MM.YYYY'),{silent:true});
    }
    onRender() {
        var self = this;
        $.fn.datetimepicker.Constructor.Default = $.extend({}, $.fn.datetimepicker.Constructor.Default, {
            format: 'DD.MM.YYYY'
        });
        this.getListData().then(() => {
            $('#country').select2({
                templateResult: (option)=>{
                    return `<i class="ui-flag ${option.id}"></i> ${option.text}`
                },
                templateSelection: function (option) {
                    if (option.id.length > 0 ) {
                        return `<i class="ui-flag ${option.id}"></i> ${option.text}`;
                    } else {
                        return option.text;
                    }
                },
                width: '100%', // need to override the changed default,
                escapeMarkup: (m) => {
                    return m;
                }
            });
            $('#client_id').select2({
                width: '100%' // need to override the changed default
            });
            $('#status').select2({
                width: '100%' // need to override the changed default
            });
            var cl = $('#color').select2({
                width: '100%', // need to override the changed default
                tags: true,
                createTag: function (params) {
                  var no = {
                    id: params.term,
                    text: params.term,
                    newOption: true
                  }
                  return no;
                },
                templateResult: (option)=>{
                    return `<div style="display:inline-block;width:10px;height:10px;background-color: ${option.id}"></div> ${option.text}`
                },
                templateSelection: function (option) {
                    if (option.id.length > 0 ) {
                        return `<div style="display:inline-block;width:10px;height:10px;background-color: ${option.id}"></div> ${option.text}`;
                    } else {
                        return `<div style="display:inline-block;width:10px;height:10px;background-color: ${option.text}"></div> ${option.text}`;
                    }
                },
                escapeMarkup: (m) => {
                    return m;
                }
            });
            var st = $('#settings').select2({
                width: '100%', // need to override the changed default
                tags: true,
                createTag: function (params) {
                  return {
                    id: params.term,
                    text: params.term,
                    newOption: true
                  }
                },
                 templateResult: function (data) {
                  var $result = $("<span></span>");
              
                  $result.text(data.text);
              
                  if (data.newOption) {
                    $result.append(" <em>(new)</em>");
                  }
              
                  return $result;
                }
                // matcher:function(params, data) {
                    
                //     // console.log(data)
                //     if(!params.term) return data;
                //     var filtered =  $(data).filter( function() {
                //         return this.text.search(params.term) != -1;
                //     });
                //     if (filtered.length===0) {
                //         var prevData = $(data).filter(function(){
                //             return this.text.search(params.term.substr(params.term.length-1,1)) != -1
                //         });
                //         if(prevData.length > 0){
                //             console.log(prevData[0])    
                //             return prevData[0]
                //         }else{
                //             var newOption = new Option(params.term,params.term,false,false);
                //             $('#settings').append(newOption);
                //             return newOption
                //         }
                //     }else{
                //         return data;
                //     }
                // },
            });
            st.on('select2:select',(ev)=>{self.model.set('settings',ev.params.data.id)});
            cl.on('select2:select',(ev)=>{self.model.set('color',ev.params.data.id)});
            self.stickit();
        })
        // this.stickit()
    }
    getListData() {
        var self = this;
        return new Promise((resolve, reject) => {
            $.get(app.baseUrl + 'customers/index').then((resp) => {
                self.buildCustomers(resp);
                self.buildCountries();
                self.buildSettingsList().then(resolve);
                // resolve()
            });
        })
    }
    buildCustomers(data) {
        for (var i = 0; i < data.length; i++) {
            var cust = data[i]
            this.$('#client_id').append($('<option>', {
                value: cust.id,
                text: cust.name
            }));
        }
    }
    buildCountries() {
        for (var i = 0; i < Countries.list.length; i++) {
            var c = Countries.list[i]
            this.$('#country').append($('<option>', {
                value: c.iso2,
                text: c.name
            }));
        }
    }
    buildSettingsList(){
        var self = this;
        return new Promise((resolve)=>{
            $.get(app.baseUrl + 'utils/settingslist').then((response)=>{
                $.each(response,(i,setting)=>{
                    self.$('#settings').append(`<option value="${setting}">${setting}</option>`)
                    resolve()
                });
            })
        });
    }
    getModel() {
        this.model.fetch().then((resp) => { console.log(resp) });
    }

    save(e){
        var self = this;
        e.preventDefault();
        this.model.save({},{
            success:()=>{
                // self.model.collection.refresh()
            }
        })
    }

}