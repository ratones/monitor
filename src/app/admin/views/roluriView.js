export default class RoluriView extends Mn.View {
    constructor(props) {
        var options = $.extend(props, {});
        super(options);
        this.template = '<div></div>';
        this.elid = options.element;
        this.parentID = options.parentID;
    }
    onRender() {
        var self = this;
        $.post(app.Admin.baseUrl + 'users/getroluriselect', {}, function(response) {
            self.roluri = response.items;
            self.renderGrid();
        });
    }

    renderGrid() {
        var self = this;
        $(self.elid).w2grid({
            name: 'gridRoluri_' + self.parentID,
            url: app.Admin.baseUrl + 'users/getroluri/' + self.parentID,
            recid: 'id',
            columns: [{
                field: 'id',
                hidden: true
            }, {
                field: 'roleid',
                hidden: true
            }, {
                field: 'userid',
                hidden: true
            }, {
                field: 'numerol',
                caption: 'Nume rol',
                size: '25%',
                editable: {
                    type: 'list',
                    items: self.roluri,
                    minLength: 0
                }
            }, {
                field: 'descriere',
                caption: 'Descriere',
                size: '75%'
            }],
            onChange: function(e) {
                var rol = e.value_new;
                //e.value_new = e.value_new.text;
                 var record = this.get(this.getSelection()[0]);
                 this.set(record.recid, {
                        numerol:rol,
                        descriere: rol.descriere
                });
            },
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
                toolbarSave: true,
                toolbarDelete: true
            },
            onSave:function(e){
              for(var i in e.changes){
              var rol = e.changes[i].numerol;
              e.changes[i].numerol = rol.text;
              e.changes[i].descriere = rol.descriere;
              e.changes[i].roleid = rol.id;
              e.changes[i].userid = self.parentID;
            }
              console.log(e);
            },
            parser: function(response) {
                var data = $.parseJSON(response);
                return {
                    status: 'success',
                    records: data.rows,
                    total: data.records
                };
            },
            onAdd: function() {
                this.add({
                    recid: 0,
                    userid: self.parentID
                }, true);
            }
        });
    }


    onBeforeDestroy() {
        //manually cleanup
        w2ui['gridRoluri_' + this.parentID].destroy();
    }
}
