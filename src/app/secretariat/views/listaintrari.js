export default class ListaIntrariView extends Mn.View {
    constructor(props) {
        var options = $.extend(props, {
            gridName: 'gridIntrari'
        });
        super(options);
        this.template = '<div class="fullscreen"></div>';
    }

    onAttach() {
        var self = this;
        // if(w2ui.hasOwnProperty('gridIntrari'))
        //   w2ui.gridIntrari.render(this.$el);
        this.$el.css({height:'100%'}).w2grid({
            name: 'gridIntrari',
            url: app.Secretariat.baseUrl + 'registru/getIntrari',
            recid:'id',
            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarEdit: true,
                toolbarDelete: true,
                footer: true
            },
            columns: [{
                field: 'nr_inregistrare',
                caption: 'Nr. Inregistrare',
                size: '120px',
                sortable: true
            }, {
                field: 'data_inreg',
                caption: 'Data Inregistrare',
                type: 'date',
                size: '150px',
                sortable: true
            }, {
                field: 'tip',
                caption: 'Tip cerere',
                size: '250px',
                sortable: true,
                render: function(record) {
                    return self.tipCerereFormatter(record.tip);
                }
            }, {
                field: 'provenienta',
                caption: 'Provenienta',
                size: '300px',
                sortable: true
            }, {
                field: 'repartizare',
                caption: 'Repartizare',
                size: '30%',
                sortable: true
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onAdd:function(){
              app.Secretariat.Controller.editIntrare();
            },
            onEdit:function(e){
              app.Secretariat.Controller.editIntrare(e.recid);
            }

        });
    }

    tipCerereFormatter(cellvalue) {
        switch (cellvalue) {
            case 1:
                return 'Omologare tip';
            case 2:
            case 9:
                return 'Inregistrare nationala';
            case 3:
            case 0:
                return 'Diverse';
            default:
                return 'Diverse';
        }
    }

    onBeforeDestroy(){
      w2ui.gridIntrari.destroy();
    }
}
