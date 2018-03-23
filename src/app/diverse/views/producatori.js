export default class ProducatoriView extends Mn.View {
    constructor(properties) {
        var options = $.extend(properties, {
            gridName: 'gridProducatori'
        });
        super(options);
        this.template = '<div class="fulscreen"></div>';;
    }

    onAttach() {
        var self = this;
        this.$el.css({
            height: '100%'
        }).w2grid({
            name: 'gridProducatori',

            url: app.Diverse.baseUrl + 'diverse/getproducatori',

            recid: 'id',
            onAdd:function(e){
              this.add({recid:0},true)
            },
            show: {
                toolbar: true,
                // toolbarAdd: true,
                toolbarSave: true,
                // toolbarDelete: true,
                footer: true
            },

            columns: [{
                field: 'id',
                hidden: true
            }, {
                field: 'denumire',
                caption: 'Denumire',
                type: 'text',
                size: '25%',
                sortable: true
            }, {
                field: 'categorie',
                caption: 'Categorie',
                type: 'text',
                size: '25%',
                sortable: true
            }, {
                field: 'denumire_oem',
                caption: 'Denumire OEM',
                type: 'text',
                size: '25%',
                sortable: true
            }, {
                field: 'denumire_app',
                caption: 'Denumire Reala',
                type: 'text',
                size: '25%',
                sortable: true,
                editable:{
                  type:'text'
                }
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            }
        });
    }
    onBeforeDestroy() {
        w2ui.gridProducatori.destroy();
    }

}
