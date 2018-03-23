export default class PrescriptiiView extends Mn.View {
    constructor(properties) {
        var options = $.extend(properties, {
            gridName: 'gridPrescriptii'
        });
        super(options);
        this.template = '<div class="fulscreen"></div>';
    }

    onAttach() {
        var self = this;
        this.$el.css({
            height: '100%'
        }).w2grid({
            name: 'gridPrescriptii',

            url: app.Diverse.baseUrl + 'nrom/getPrescriptii',
            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarSave: true,
                toolbarDelete: true
            },
            recid: 'id',
            onAdd: function(e) {
                this.add({
                    recid: 0
                }, true);
            },
            columns: [{
                field: 'id',
                caption: 'ID',
                type: 'int',
                sortable: true,
                hidden: true
            }, {
                field: 'coloana',
                caption: 'Pozitia WVTA',
                type: 'text',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, {
                field: 'act_normativ',
                caption: 'Act Normativ',
                type: 'text',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, {
                field: 'categorie',
                caption: 'Aplicare',
                type: 'text',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, {
                field: 'categorie_ue',
                caption: 'Categorii',
                type: 'text',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'text'
                }
            }, {
                field: 'datain',
                caption: 'Data Aplicarii',
                type: 'date',
                size: '20%',
                sortable: true,
                editable: {
                    type: 'date'
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
            onExpand: function(event) {
                if (w2ui.hasOwnProperty('gridCerinte_' + event.recid)) {
                    w2ui['gridCerinte_' + event.recid].destroy();
                }
                $('#' + event.fbox_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%',
                    'background-color': '#229aca'
                }).animate({
                    height: '305px'
                }, {
                    duration: 100
                });

                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '305px'
                }, {
                    duration: 100,
                    complete: function() {
                        setTimeout(function() {
                            var record = w2ui['gridPrescriptii'].get(event.recid);
                            $('#' + event.box_id).w2grid({
                                name: 'gridCerinte_' + event.recid,
                                recid: 'id',
                                url: app.Diverse.baseUrl + 'nrom/getCerinte/' + event.recid,
                                method: 'POST',
                                show: {
                                    toolbar: true,
                                    footer: true,
                                    toolbarAdd: true,
                                    toolbarDelete: true,
                                    toolbarSave: true
                                },
                                columns: [{
                                        field: 'id',
                                        hidden: true
                                    }, {
                                        field: 'id_sistem',
                                        hidden: true
                                    }, {
                                        field: 'cerinta',
                                        caption: 'Cerinta/Exceptie',
                                        type: 'text',
                                        sortable: true,
                                        size: '25%',
                                        editable: {
                                            type: 'text'
                                        }
                                    },
                                    {
                                        field: 'categorii',
                                        caption: 'Categorii',
                                        type: 'text',
                                        sortable: true,
                                        size: '25%',
                                        editable: {
                                            type: 'text'
                                        }
                                    }, {
                                        field: 'data_exp',
                                        caption: 'Data expirarii',
                                        type: 'date',
                                        sortable: true,
                                        size: '25%',
                                        editable: {
                                            type: 'date'
                                        }
                                    }
                                ],
                                postData: {
                                    extra: [{
                                        field: 'id_sistem',
                                        value: record.id
                                    }]
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
                                    w2ui['gridCerinte_' + event.recid].add({
                                        recid: 0,
                                        id_sistem: event.recid
                                    });
                                },
                                onSave: function(e) {
                                    var me = this;
                                    e.changes.map(function(c) {
                                        c.id_sistem = event.recid;
                                        return c;
                                    });
                                    // for (var i in e.changes) {
                                    //     e.changes[i].id_sistem=event.recid;
                                    // }
                                    e.onComplete - function() {
                                        me.reload();
                                    }
                                },
                                // fixedBody: false
                            });
                            w2ui['gridCerinte_' + event.recid].resize();
                        }, 300);
                    } // end complete func
                });
            }
        });
    }
    onBeforeDestroy() {
        w2ui.gridPrescriptii.destroy();
    }

}
