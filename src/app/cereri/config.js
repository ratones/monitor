let config = {
    index() {
        var self = this;
        return {
            name: 'gridCereri',
            url: app.baseUrl + '/comenzi/getComenzi',
            method: 'POST', // need this to avoid 412 error on Safari
            recid: 'id',
            fixedBody: true,
            show: {
                toolbar: true,
                footer: true,
                toolbarAdd: true,
                toolbarDelete: self.allowDelete,
                //toolbarSave: true,
                //toolbarEdit: true,
                expandColumn: true
            },
            toolbar: {
                items: [
                    //{type: 'break'},
                    {
                        type: 'button',
                        id: 'btnEdit',
                        caption: 'Editare',
                        icon: 'w2ui-icon-pencil',
                        onClick: function(event) {
                            app.Cereri.controller.editCerere(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        disabled: true,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                            app.router.navigate('cereri/spreadsheetVehicule/' + w2ui['gridCereri'].getSelection(), true);
                        }
                    }, {
                        type: 'break'
                    }, {
                        type: 'button',
                        id: 'btnJurnal',
                        caption: 'Jurnal',
                        icon: 'w2ui-icon-search',
                        onClick: function(e) {
                            self.getJurnal(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        id: 'btnUpload',
                        caption: 'Alege fisier',
                        icon: 'w2ui-icon-upload',
                        onClick: function(event) {
                            self.choosefile();
                        }
                    }, {
                        type: 'button',
                        id: 'btnPlata',
                        caption: 'Instiintare plata',
                        icon: 'w2ui-icon-eur',
                        onClick: function(e) {
                            app.Cereri.controller.detaliiPlataCerere(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'button',
                        id: 'btnRaport',
                        caption: 'Raport',
                        icon: 'w2ui-icon-print',
                        disabled: true,
                        onClick: function(e) {
                            self.getRaport(w2ui['gridCereri'].getSelection());
                        }
                    }, {
                        type: 'break'
                    }, {
                        type: 'button',
                        id: 'btnPostComanda',
                        caption: 'Transmite comanda!',
                        icon: 'w2ui-icon-send',
                        onClick: function(e) {
                            w2confirm('Sigur finalizati aceasta comanda?').yes(function(response) {
                                w2ui.gridCereri.lock();
                                var id = w2ui.gridCereri.getSelection();
                                //alert('ok');
                                app.Cereri.controller.transmitComanda(id, self.refreshGrid);
                            });
                        }
                    },
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnPrintCIV',
                        caption: 'Tipar',
                        icon: 'w2ui-icon-print',
                        disabled: true,
                        onClick: function(e) {
                            self.printRaport(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowPrint ? {
                        type: 'button',
                        id: 'btnArhivareCIV',
                        caption: 'Arhivare',
                        icon: 'w2ui-icon-file',
                        disabled: true,
                        onClick: function(e) {
                            self.arhivareCIV(w2ui['gridCereri'].getSelection());
                        }
                    } : {}),
                    (self.allowDelete ? {
                        type: 'button',
                        id: 'btnAnulare',
                        caption: 'Anulare',
                        icon: 'w2ui-icon-ban_circle',
                        disabled: true,
                        onClick: function(e) {
                            self.anulareComanda(w2ui['gridCereri'].getSelection());
                        }
                    } : {})
                ]
            },
            onDblClick: function(event) {
                var record = w2ui['gridCereri'].get(event.recid);
                if (record.depusa < 10) {
                    app.Cereri.controller.editCerere(event.recid);
                }
            },
            multiSearch: true,
            searches: [{
                field: 'id',
                caption: 'Nr.Comanda ',
                type: 'text'
            }, {
                field: 'data_comanda',
                caption: 'Data',
                type: 'date'
            }, {
                field: 'nr_inreg_soc',
                caption: 'Nr client',
                type: 'text'
            }, {
                field: 'data_inreg',
                caption: 'Data client',
                type: 'date'
            }, {
                field: 'societate',
                caption: 'Beneficiar',
                type: 'text'
            }, {
                field: 'stare_comanda',
                caption: 'Stare',
                type: 'list',
                options: {
                    items: ['Finalizata', 'In lucru', 'Prelucrata', 'Depusa']
                }
            }, {
                field: 'vin',
                caption: 'V.I.N.',
                type: 'text'
            }, {
                field: 'serie_civ',
                caption: 'Serie CIV',
                type: 'text'
            },{
              field:'nr_registru',
              caption:'Nr registru',
              type:'text'
            }],
            onSearch: function(event) {
                if (event.multi) {
                    for (var i in event.searchData) {
                        var sf = event.searchData[i];
                        // sf['oper'] = sf['operator'];
                        // delete sf['operator'];
                        if (sf.field === 'stare_comanda') {
                            sf.field = 'depusa';
                            switch (sf.value) {
                                case 'In lucru':
                                    sf.value = '(0,1,2,3,4)';
                                    break;
                                case 'Finalizata':
                                    sf.value = '15';
                                    break;
                                case 'Depusa':
                                    sf.value = '(10,11,12,15)';
                                    break;
                                case 'Prelucrata':
                                    sf.value = '11';
                                    break;
                                default:
                                    break;
                            }
                            sf.operator = 'isin';
                        }
                    }
                }else{
                	for (var i in event.searchData) {
                        var sf = event.searchData[i];
                        if(sf.type === 'date'){
                        	sf.type = 'text'
                        }
                    }
                }

            },
            columns: [{
                    field: 'id',
                    caption: 'Nr.Comanda',
                    size: '150px',
                    sortable: true
                }, {
                    field: 'data_comanda',
                    caption: 'Data',
                    size: '220px',
                    sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_comanda).format('DD.MM.YYYY');
                        //                        }
                }, {
                    field: 'data_transmitere',
                    caption: 'Data transmitere',
                    size: '220px',
                    sortable: true
                }, {
                    field: 'nr_inreg_soc',
                    caption: 'Nr client',
                    size: '100px',
                    sortable: true
                }, {
                    field: 'societate',
                    caption: 'Beneficiar',
                    size: '30%',
                    sortable: true
                }, {
                    field: 'data_inreg',
                    caption: 'Data client',
                    size: '120px',
                    sortable: true
                        //                        render: function(record) {
                        //                            return app.moment(record.data_inreg).format('DD.MM.YYYY');
                        //                        }
                }, {
                    field: 'stare_plata',
                    caption: 'Stare plata',
                    size: '150px',
                    sortable: true,
                    render: function(record) {
                        switch (record.stare_plata) {
                            case 1:
                                return '<b style="color:green">ACHITAT</b>';
                            case 2:
                                return '<b style="color:red">NEACHITAT</b>';
                            default:
                                return '<b>NEPRELUCRAT</b>';
                        }
                    }
                }, {
                    field: 'stare_comanda',
                    caption: 'Stare',
                    size: '25%',
                    sortable: true,
                    render: function(record) {
                        var cls = '',
                            stare = '';
                        switch (record.depusa) {
                            case 0:
                            case 90:
                                cls = 'label label-default';
                                stare = 'Adaugati vehicule';
                                break;
                            case 1:
                            case 91:
                                stare = 'In lucru - OK';
                                cls = 'label label-primary';
                                break;
                            case 2:
                            case 92:
                            case 3:
                            case 93:
                                stare = 'In lucru - Vehicule invalide';
                                cls = 'label label-warning';
                                break;
                            case 4:
                            case 94:
                                stare = 'In lucru - Vehicule invalide';
                                cls = 'label label-danger';
                                break;
                            case 10:
                                stare = 'Depusa - asteapta prelucrare';
                                cls = 'label label-waiting';
                                break;
                            case 11:
                                stare = 'Prelucrata - OK';
                                cls = 'label label-ready';
                                break;
                            case 12:
                                stare = 'In prelucrare';
                                cls = 'label label-waiting';
                                break;
                            case 9:
                                stare = 'In eroare - vehicule netransmise';
                                cls = 'label label-warning';
                                break;
                            case 15:
                                stare = 'Finalizata';
                                cls = 'label label-success';
                                break;

                        }
                        return '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="' + cls + '">&nbsp;&nbsp;&nbsp;</label>';

                    }
                }, {
                    field: 'countvehicule',
                    caption: 'Nr. Vehicule',
                    size: '100px',
                    sortable: true
                }

            ],
            parser: function(responseText) {
                var data = $.parseJSON(responseText);
                // do other things
                return {
                    status: 'success',
                    total: data.records,
                    records: data.rows
                };
            },
            onAdd: function(event) {
                app.Cereri.controller.editCerere();
            },
            onSelect: function(e) {
                e.onComplete = function() {
                    var record = w2ui['gridCereri'].get(e.recid);
                    if (record.stare_plata === 2) {
                        w2ui['gridCereri'].toolbar.enable('btnPlata');
                    }
                    if (record.depusa !== 0) {
                        w2ui['gridCereri'].toolbar.enable('btnJurnal');
                    }
                    if (record.depusa === 15 && record.stare_plata === 1) {
                        w2ui['gridCereri'].toolbar.enable('btnArhivareCIV');
                    }
                    if (record.depusa === 15) {
                        w2ui['gridCereri'].toolbar.enable('btnRaport');
                    }
                    if (record.depusa == 11) {
                        w2ui['gridCereri'].toolbar.enable('btnPrintCIV');
                        w2ui['gridCereri'].toolbar.enable('btnAnulare');

                    }
                    if (record.depusa == 11 || record.depusa === 15) {
                        w2ui['gridCereri'].toolbar.enable('btnArhivareCIV');
                    }
                    //comanda nu este depusa, putem face unele actiuni
                    if (record.depusa < 10 || record.depusa > 89) {
                        w2ui['gridCereri'].toolbar.enable('btnEdit');
                        w2ui['gridCereri'].toolbar.enable('w2ui-delete');
                        w2ui['gridCereri'].toolbar.enable('btnUpload');
                        w2ui['gridCereri'].toolbar.enable('btnExcel');
                        if (record.depusa === 1 || record.depusa === 91) {
                            w2ui['gridCereri'].toolbar.enable('btnPostComanda');
                        }
                    } else {
                        w2ui['gridCereri'].toolbar.disable('btnEdit');
                        w2ui['gridCereri'].toolbar.disable('w2ui-delete');
                    }
                };
            },
            onLoad: self.disableGridButtons,
            onUnselect: self.disableGridButtons,
            onCollapse: function() {
                if (w2ui.hasOwnProperty('gridVehicule_' + event.recid)) {
                    w2ui['gridVehicule_' + event.recid].destroy();
                }
            },
            onExpand: function(event) {
                if (w2ui.hasOwnProperty('gridVehicule_' + event.recid)) {
                    w2ui['gridVehicule_' + event.recid].destroy();
                }
                $('#'+event.fbox_id).css({
                  margin: '0px',
                  padding: '0px',
                  width: '100%'
                }).animate({
                    height: '505px'
                },{duration:10});
                $('#' + event.box_id).css({
                    margin: '0px',
                    padding: '0px',
                    width: '100%'
                }).animate({
                    height: '505px'
                }, {
                    duration: 10,
                    complete: function() {
                        var record = w2ui['gridCereri'].get(event.recid);
                        app.Cereri.controller.listVehicule(event.box_id, {
                            pid: event.recid,
                            canadd: record.depusa < 10 || record.depusa > 89,
                            totalVehicule: record.countvehicule
                        });
                        w2ui.layout.resize();
                    }
                });
            },
            onRender: function(event) {
                event.onComplete = function() {
                    //                        onRender: function () {

                    //                        },
                };
            }
        };
    },
    plati() {

    },
    vehicule(){
      var self = this;
      return {
        name: 'gridVehicule_' + this.parentID,
        url: app.baseUrl + '/vehicule/getvehicule/' + self.parentID,
        method: 'POST', // need this to avoid 412 error on Safari
        recid: 'id',
        show: {
            toolbar: true,
            footer: true,
            selectColumn: true
        },
        columns: [{
            field: 'id',
            caption: 'ID',
            sortable: true,
            hidden: true,
            size: '1px'
        }, {
            field: 'nr_registru',
            caption: 'Nr. Omologare',
            sortable: true,
            size: '25%'
        }, {
            field: 'vin',
            caption: 'VIN',
            sortable: true,
            size: '25%'
        }, {
            field: 'wvta',
            caption: 'WVTA',
            sortable: true,
            size: '25%',
            render:function(rec){
                return rec.wvta + '*' + rec.extensie;
            }
        }, {
            field: 'motiv_respingere',
            caption: 'Stare In Clar',
            sortable: true,
            size: '25%',
            hidden: true,
            searchable: false
        }, {
            field: 'stare',
            caption: 'Status',
            sortable: true,
            size: '25%',
            render: function(record) {
                var cls = 'default',
                    stare = record.motiv_respingere;
                switch (record.stare) {
                    case 0:
                        // stare = 'OK';
                        cls = 'label-default';
                        break;
                    case 1:
                        // stare = 'OK';
                        cls = 'label-primary';
                        break;
                    case 2:
                        // stare = 'Date eronate';
                        cls = 'label-warning';
                        break;
                    case 3:
                    case 8:
                        // stare = 'Invalid';
                        cls = 'label-danger';
                        break;
                    case 10:
                        // stare = 'Transmis';
                        cls = 'label-waiting';
                        break;
                    case 11:
                        // stare = 'Prelucrat OK';
                        cls = 'label-ready';
                        break;
                    case 12:
                        // stare = 'Nu se poate prelucra';
                        cls = 'label-warning';
                        break;
                    case 4:
                        // stare = 'Netransmis';
                        cls = 'label-danger';
                        break;
                    case 15:
                        // stare = 'Tiparit';
                        cls = 'label-success';
                        break;
                    default:
                        break;
                }
                var html = '<div style="width:200px;float:left">' + stare + '</div><label style="font-size:9px" class="label ' + cls + '">&nbsp;&nbsp;&nbsp;</label>';
                return html;
            }
        }],
        toolbar: {
            items: [{
                type: 'button',
                caption: 'Adauga',
                icon: 'w2ui-icon-plus',
                id: 'btnAddVehicul',
                disabled: !self.canadd,
                onClick: function(e) {
                    self.destroy();
                    app.Cereri.router.navigate('cereri/addVehicul/' + self.parentID, true);
                }
            }, {
                type: 'button',
                id: 'btnEditVehicul',
                caption: 'Edit',
                icon: 'w2ui-icon-pencil',
                disabled: true,
                onClick: function(event) {
                    var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                    self.destroy();
                    app.Cereri.router.navigate('cereri/detaliiVehicul/' + id, true);
                }
            }, {
                type: 'button',
                id: 'btnDeleteVehicul',
                caption: 'Sterge',
                icon: 'w2ui-icon-cross',
                disabled: true,
                onClick: function(event) {
                    w2ui['gridVehicule_' + self.parentID].delete();
                }
            }, {
                type: 'break'
            }, {
                type: 'button',
                id: 'btnDetaliiVehicul',
                icon: 'w2ui-icon-search',
                caption: 'Detalii',
                disabled: true,
                onClick: function(event) {
                    var id = w2ui['gridVehicule_' + self.parentID].getSelection();
                    self.infoVehicul(id);
                }
            },
            {
                type: 'button',
                id: 'btnNewWin',
                icon: 'w2ui-icon-list',
                caption: 'Detaseaza',
                disabled: false,
                onClick: function(event) {
                    self.win = $.jsPanel({
                      id:'listvehicles' + self.parentID,
                      headerTitle:'Lista vehicule comanda '+ self.parentID,
                      contentSize:'1000 800',
                      content:`<div id="dettach${self.parentID}" ></div>`,
                      callback:(e)=>{
                        var el = $(`#dettach${self.parentID}`);
                        el.css('height','100%');
                        el.w2render('gridVehicule_' + self.parentID);
                      },
                      onresized:()=>{
                        w2ui['gridVehicule_' + self.parentID].resize();
                      },
                      onmaximized:()=>{
                        w2ui['gridVehicule_' + self.parentID].resize();
                      },
                      onnormalized:()=>{
                        w2ui['gridVehicule_' + self.parentID].resize();
                      },
                      onclosed:(e)=>{
                        $(self.elid).w2render('gridVehicule_' + self.parentID);
                      }
                    })
                }
            }]
        },
        onDblClick: function(event) {
            var b = this.get(event.recid).stare;
            if (b < 10 && (b !== 4 && b !== 3)) {
                self.destroy();
                app.Cereri.router.navigate('cereri/detaliiVehicul/' + event.recid, true);
            }
        },
        multiSearch: false,
        multiSelect: true,
        searches: [{
            field: 'vin',
            caption: 'V.I.N. ',
            type: 'text'
        }, {
            field: 'wvta',
            caption: 'W.V.T.A.',
            type: 'text'
        }, {
            field: 'nr_registru',
            caption: 'Nr. Omologare',
            type: 'text'
        }, {
            field: 'stare',
            caption: 'Status',
            type: 'list',
            options: {
                items: ['In lucru', 'Remediabile', 'Transmise', 'Prelucrate', 'Invalide', 'Tiparite']
            }
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
        onDeleted: function(event) {
            var response = JSON.parse(event.xhr.responseText);
            w2ui.gridCereri.get(response.id_comanda).depusa = response.status_comanda;
            w2ui.gridCereri.refreshCell(response.id_comanda, 'stare_comanda');
        },
        onSelect: function(event) {
            if (event.recid) {
                var b = this.get(event.recid).stare;
                if (b !== 4 && b !== 3) {
                    this.toolbar.enable('btnDetaliiVehicul');
                }
                if (b < 10) {
                    this.toolbar.enable('btnDeleteVehicul');
                    if (b !== 4 && b !== 3) {
                        this.toolbar.enable('btnEditVehicul');
                    }
                }
            }

        },
        onUnselect: function() {
            this.toolbar.disable('btnEditVehicul');
            this.toolbar.disable('btnDeleteVehicul');
            this.toolbar.disable('btnDetaliiVehicul');
        },
        fixedBody: true,
        onSearch: function(event) {
            for (var i in event.searchData) {
                var sf = event.searchData[i];
                // sf['oper'] = sf['operator'];
                // delete sf['operator'];
                if (sf.field === 'stare') {
                    switch (sf.value) {
                        case 'In lucru':
                            sf.value = '(0,1,2)';
                            break;
                        case 'Remediabile':
                            sf.value = '(2)';
                            break;
                        case 'Transmise':
                            sf.value = '(10,11,12,15)';
                            break;
                        case 'Prelucrate':
                            sf.value = '11';
                            break;
                        case 'Invalide':
                            sf.value = '(4,12,8,3)';
                            break;
                        case 'Tiparite':
                            sf.value = '15';
                            break;
                        default:
                            break;
                    }
                    sf.operator = 'isin';
                }
            }

        }
      }
    },

     menu: function() {
        return [{
            visibility: {
                anonim: false,
                authenticated: true
            },
            label: 'Cereri',
            submenu: [{
                label: ' Inregistrare de tip',
                click: function() {
                    window.location.hash = '#diverse/listaBeneficiari';
                },
                icon:'./assets/menuicons/users.png'
            }, {
                label: ' Omologare',
                click: function() {
                    window.location.hash = '#diverse/listaProducatori';
                },
                icon:'./assets/menuicons/users.png',
            }, {
                label: ' Toate cererile',
                click: function() {
                    window.location.hash = '#diverse/listaActeNormative';
                },
                icon:'./assets/menuicons/list.png',
            }]
        }];
    }
};

module.exports = config;
