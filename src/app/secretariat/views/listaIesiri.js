export default class ListaIesiriView extends Mn.View{
  constructor(properties){
    var options = $.extend(properties, {gridName: 'gridIesiri'});
    super(options);
    this.template = '<div class="fulscreen"></div>';
  }

  onAttach(){
    var self = this;
    this.$el.css({height: '100%'}).w2grid({
      name: 'gridIesiri',
      url: app.Secretariat.baseUrl + 'registru/getIesiri',
      recid: 'id',
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
        field:'data_expediere',
        caption: 'Data Expediere',
        type: 'date',
        size: '150px',
        sortable: true
      }, {
        field: 'mod_rezolvare',
        caption: 'Mod Rezolvare',
        size: '300px',
        sortable: true
      }, {
        field: 'observatii',
        caption: 'Observatii',
        size: '30%',
        sortable: true
      }, {
        field: 'legatura_intrare',
        caption: 'Legatura Intrare',
        size: '150px',
        sortable: true
      }],
      parser: function (responseText) {
        var data = $.parseJSON(responseText);
        return {
          status: 'success',
          total: data.records,
          records: data.rows
        };
      },
      onAdd:function(){
        app.Secretariat.Controller.editIesire();
      },
      onEdit:function(e){
        app.Secretariat.Controller.editIesire(e.recid);
      }
    });
  }

  onBeforeDestroy(){
    w2ui.gridIesiri.destroy();
  }
}
