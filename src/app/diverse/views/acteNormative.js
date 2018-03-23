export default class ActeNormativeView extends Mn.View {
    constructor(properties) {
        var options = $.extend(properties, {
            gridName: 'gridActeNormative'
        });
        super(options);
        this.template = '<div class="fullscreen"></div>';
    }

    onAttach() {
        var self = this;
        var tipuri = [{id:'N',text:'Automat'},{id:'C',text:'Cadru'},{id:'D',text:'Manual'}];
        this.$el.css({
            height: '100%'
        }).w2grid({
            name: 'gridActeNormative',

            url: app.Diverse.baseUrl + 'diverse/getacte',

            recid: 'id_document_normativ',

            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarSave: true,
                toolbarDelete: true,
                footer: true
            },
            onAdd: function() {
                w2ui['gridActeNormative'].add({
                    recid: 0
                }, true);
            },
            columns: [{
                    field: 'nr_act',
                    caption: 'Numar Act',
                    editable: {
                        type: 'text'
                    },
                    size: '20%',
                    sortable: true
                },
                {
                    field: 'obiect',
                    caption: 'Obiect',
                    editable: {
                        type: 'text'
                    },
                    type: 'text',
                    size: '40%',
                    sortable: true
                },
                {
                    field: 'tip_act',
                    type: 'text',
                    caption: 'Categorie',
                    editable: {
                        type: 'list',
                        items: [
                            'REGULAMENTE UE',
                            'REGULAMENTE',
                            'DIRECTIVE'
                        ]
                    },
                    size: '150px',
                    sortable: true
                }, {
                    field: 'tip_generare',
                    caption: 'Tip generare',
                    type: 'text',
                    sortable: true,
                    editable: {
                        type: 'list',
                        items: tipuri//['Automat', 'Manual', 'Cadru']
                    },
                    size: '150px'
                },
            ],
            onSave:function(e){
              for(var i in e.changes){
                var changes = {};
                changes.tip_generare = e.changes[i].tip_generare.text;
                changes.numar_generat_manual = e.changes[i].tip_generare.id;
                changes.tip_act = e.changes[i].tip_act.id;
                $.extend(e.changes[i],changes);
              }
            },

            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onExpand: function(event) {
              var act = w2ui['gridActeNormative'].get(event.recid);
                if (w2ui.hasOwnProperty('gridAmendamente' + event.recid)) {
                    w2ui['gridAmendamente' + event.recid].destroy();
                }
                $('#' + event.fbox_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '205px'
                }, {duration: 100});

                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '205px'
                }, {
                    duration: 100,
                    complete: function() {
                        setTimeout(function() {
                            $('#' + event.box_id).w2grid({
                                name: 'gridAmendamente' + event.recid,
                                url: app.Diverse.baseUrl + 'diverse/getAmendamente/' + event.recid,
                                recid: 'id',
                                // fixedBody: false,
                                show: {
                                    toolbar: true,
                                    toolbarAdd: true,
                                    toolbarSave: true,
                                    toolbarDelete: true,
                                    footer: true
                                },
                                columns: [{
                                    field: 'nr_amendament',
                                    caption: 'Numar Amendament',
                                    size: '50%',
                                    editable: {
                                        type: 'text'
                                    },
                                    sortable: true
                                }, {
                                    field: 'nr_act_baza',
                                    caption: 'Act Baza',
                                    size: '50%',
                                    sortable: true
                                }],
                                parser: function(response) {
                                    var data = JSON.parse(response);
                                    return {
                                        status: 'success',
                                        records: data.rows,
                                        total: data.records
                                    };
                                },
                                onAdd:function(){
                                    this.add({
                                        recid: 0,
                                        nr_act_baza: act.nr_act
                                    },true);
                                },
                                onSave:function(e){
                                    for (var i in e.changes) {
                                        e.changes[i].nr_act_baza=act.nr_act;
                                    }
                                    var self = this;
                                    e.onComplete=function(){
                                        self.reload();
                                    }
                                }
                            });
                            w2ui['gridAmendamente' + event.recid].resize();
                        }, 300);
                    }
                });
            }
        });
    }

    onBeforeDestroy() {
        w2ui.gridActeNormative.destroy();
    }

}
