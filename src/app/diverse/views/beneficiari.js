export default class BeneficiariView extends Mn.View {
    constructor(properties) {
        var options = $.extend(properties, {
            gridName: 'gridBeneficiari'
        });
        super(options);
        this.template = '<div class="fulscreen"></div>';
    }

    onAttach() {
        var self = this;
        this.$el.css({
            height: '100%'
        }).w2grid({

          onAdd: function(){
            app.Diverse.Controller.editBeneficiari();
          },
          onEdit: function(e){
            app.Diverse.Controller.editBeneficiari(e.recid);
          },
            name: 'gridBeneficiari',

            url: app.Diverse.baseUrl + 'beneficiari/getBeneficiari',

            recid: 'id_benef',

            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarEdit: true,
                toolbarDelete: true,
                footer: true
            },

            columns: [{
                field: 'id_benef',
                caption: 'ID',
                type: 'int',
                sortable: true,
                hidden: true
            }, {
                field: 'denumire_beneficiar',
                caption: 'Denumire',
                type: 'text',
                size: '25%',
                sortable: true
            }, {
                field: 'adresa2',
                caption: 'Adresa',
                type: 'text',
                size: '45%',
                sortable: true
            }, {
                field: 'email',
                caption: 'Email',
                type: 'text',
                size: '20%',
                sortable: true
            }, {
                field: 'telefon',
                caption: 'Nr. Telefon',
                type: 'text',
                size: '10%',
                sortable: true
            }],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },

            onExpand: function(event) {
                if (w2ui.hasOwnProperty('gridReprezentanti' + event.recid)) {
                    w2ui['gridReprezentanti' + event.recid].destroy();
                }
                $('#'+event.fbox_id).css({
                  margin: '0px',
                  padding: '0px',
                  width: '100%'
                }).animate({
                    height: '250px'
                },{duration:100});
                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '250px'
                }, {
                    duration: 100,
                    complete: function() {
                        setTimeout(function() {
                            $('#' + event.box_id).w2grid({
                                name: 'gridReprezentanti' + event.recid,
                                url: app.Diverse.baseUrl + 'beneficiari/getreprezentanti/' + event.recid,
                                recid: 'id_reprezentant',
                                show: {
                                    toolbar: true,
                                    toolbarAdd: true,
                                    toolbarSave: true,
                                    toolbarDelete: true,
                                    footer: true
                                },
                                onAdd:function(){
                                    this.add({recid:0},true);
                                },
                                columns: [{
                                    field: 'id_reprezentant',
                                    caption: 'ID',
                                    size: '0px',
                                    hidden: true
                                }, {
                                    field: 'id_beneficiar',
                                    caption: 'ID Beneficiar',
                                    size: '0px',
                                    hidden: true
                                }, {
                                    field: 'nume_reprezentant',
                                    caption: 'Nume reprezentant',
                                    size: '25%',
                                    editable: {
                                        type: 'text'
                                    },
                                    sortable: true
                                }, {
                                    field: 'functie',
                                    caption: 'Functie',
                                    size: '25%',
                                    editable: {
                                        type: 'text'
                                    },
                                    sortable: true
                                }, {
                                    field: 'telefon',
                                    caption: 'Telefon',
                                    size: '25%',
                                    editable: {
                                        type: 'text'
                                    },
                                    sortable: true
                                }, {
                                    field: 'email',
                                    caption: 'Email',
                                    size: '25%',
                                    editable: {
                                        type: 'email'
                                    },
                                    sortable: true
                                }],
                                parser: function(response) {
                                    var data = JSON.parse(response);
                                    return {
                                        status: 'success',
                                        records: data.rows,
                                        total: data.records
                                    };
                                }
                            });
                            w2ui['gridReprezentanti' + event.recid].resize();
                        }, 300);
                    }
                });
            }
        });
    }
    onBeforeDestroy() {
        w2ui.gridBeneficiari.destroy();
    }

}
