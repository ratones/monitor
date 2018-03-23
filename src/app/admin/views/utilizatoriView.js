export default class UtilizatoriView extends Mn.View {
    constructor(props) {
        var options = $.extend(props, {
            gridName: 'gridUtilizatori'
        });
        super(options);
        this.template = '<div class="fulscreen"></div>';
    }
    onAttach(){
      var self = this;
      $.post(app.Admin.baseUrl + 'users/getbeneficiari', {}, function(response) {
            self.beneficiari = response.items;
            self.renderGrid();
        });
    }
    renderGrid() {
        var self = this;
        this.$el.css({
            height: '100%'
        }).w2grid({

            name: 'gridUtilizatori',

            url: app.Admin.baseUrl + 'users/getusers',

            recid: 'id_user',

            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
                toolbarDelete: true,
                toolbarSave: true,
                expandColumn: true
            },

            columns: [{
                field: 'id_beneficiar',
                hidden: true
            }, {
                field: 'id_user',
                hidden: true
            }, {
                field: 'username',
                caption: 'Utilizator',
                type: 'text',
                sortable: true,
                size: '25%',
                editable: {
                    type: 'text'
                }
            }, {
                field: 'user_displayname',
                caption: 'Nume',
                type: 'text',
                sortable: true,
                size: '25%',
                editable: {
                    type: 'text'
                }
            }, {
                field: 'email',
                caption: 'Email',
                type: 'text',
                sortable: true,
                size: '25%',
                editable: {
                    type: 'email'
                }
            }, {
                field: 'type',
                caption: 'Tip',
                type: 'text',
                sortable: true,
                size: '25%',
                editable: {
                    type: 'list',
                    items: ['Intern', 'Extern']
                }
            }, {
                field: 'denumire_beneficiar',
                caption: 'Beneficiar',
                type: 'text',
                sortable: true,
                render: function(record) {
                    if (record.id_beneficiar === 0)
                        return 'RAR';
                    else
                        return record.denumire_beneficiar;
                },
                size: '25%',
                editable: {
                    type: 'list',
                    items: self.beneficiari
                }
            }],

            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onChange: function(e) {
                var field = this.columns[e.column].field;
                if (field === 'denumire_beneficiar') {
                    var benf = e.value_new;
                    this.set(e.recid, {
                        denumire_beneficiar: benf.text,
                        changes: {
                            denumire_beneficiar: benf.text,
                            id_beneficiar: benf.id
                        }
                    });
                }
                console.log(benf);
            },
            onAdd: function() {
                this.add({
                    recid: 0
                },true);
            },
            onSave:function(e){
              for(var i in e.changes){
                if(e.changes[i].denumire_beneficiar){
                  var b = e.changes[i].denumire_beneficiar;
                  e.changes[i].denumire_beneficiar = b.text;
                  e.changes[i].id_beneficiar = b.id;
                }else if(e.changes[i].type){
                  var t = e.changes[i].type;
                  e.changes[i].type = t.text;
                }
              }
            },
            onExpand:function(event){
              if (w2ui.hasOwnProperty('gridRoluri_' + event.recid)) {
                    w2ui['gridRoluri_' + event.recid].destroy();
                }

                $('#' + event.fbox_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '205px'
                }, { duration: 100});

                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '205px'
                }, {
                    duration: 100,
                    complete: function() {
                        //var record = w2ui['beneficiariGrid'].get(event.recid);
                        app.Admin.Controller.loadRoluri(event.box_id, event.recid);
                    }
                });
            }
        });
    }

    onBeforeDestroy(){
      if(w2ui.hasOwnProperty('gridUtilizatori'))
        w2ui.gridUtilizatori.destroy();
    }
}
