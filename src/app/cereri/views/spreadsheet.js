import Util from './../../util';
export default class ExcelView extends Mn.View {
    constructor(props) {
        var options = $.extend(props, {
            className: 'fullscreen',
            events: {
                'click #load': 'loadData',
                'click #save': 'saveData',
                'click #copy': 'duplicateRows',
                'click #back': 'back'
            }
        });
        super(options);
        this.template = require('./../templates/spreadsheet.html');
        this.isValid = true;
    }

    back() {
        window.location.hash = '#/cereri/cereri';
    }
    duplicateRows() {
        var array = w2ui.spreadsheetVehicule.records;
        var source = $.extend({}, array[0]);
        delete source.vin;
        delete source.recid;
        delete source.culoare;
        delete source.an;
        delete source.serie;
        for (var i = 1; i <= array.length; i++) {
            w2ui.spreadsheetVehicule.set(i, source);
        }
        w2ui.spreadsheetVehicule.save();
    }

    resetGrid() {
        w2ui.spreadsheetVehicule.columns = [];
        w2ui.spreadsheetVehicule.records = [];
        w2ui.spreadsheetVehicule.refresh();
    }

    onAttach() {
        var self = this;
        // this.validators={};
        // this.isValid = true;
        // console.log('spreadsheet');
        this.buildLoad();
        $().w2grid({
            name: 'spreadsheetVehicule',
            show: {
                toolbar: true,
                toolbarAdd: true,
                toolbarDelete: true,
                footer: true,
                lineNumbers: true
            },
            selectType: 'cell',
            records: [],
            columns: [],
            // reorderColumns:true,
            // reorderRows:true,
            fixedBody: false,
            toolbar: {
                items: [{
                    type: 'button',
                    id: 'save',
                    text: 'Salveaza',
                    icon: 'w2ui-icon-check',
                    onClick: self.saveData.bind(self)
                }, {
                    type: 'button',
                    id: 'load',
                    text: 'Incarca',
                    icon: 'w2ui-icon-upload',
                    onClick: self.loadData.bind(self)
                }, {
                    type: 'button',
                    id: 'multiply',
                    text: 'Multiplica randuri',
                    icon: 'w2ui-icon-list',
                    onClick: self.duplicateRows.bind(self)
                }, {
                    type: 'button',
                    id: 'reset',
                    text: 'Reset',
                    icon: 'w2ui-icon-trash',
                    onClick: self.resetGrid.bind(self)
                }, {
                    type: 'check',
                    id: 'anvoptionale',
                    text: 'Anvelope Optionale',
                    icon: 'w2ui-icon-wrench',
                    onClick: self.activateOptionale.bind(self)
                }]
            },
            onPaste: function(event) {
                var data = event.text.split('\n').length;
                for (var i = 1; i < data; i++) {
                    this.add({
                        recid: i
                    });
                }
                event.onComplete = this.save;
            },
            onAdd: function() {
                this.add({
                    recid: this.records.length + 1
                })
            },
            onChange: function(e) {
                e.onComplete = function() {
                    this.save();
                }
            },
            onDelete: function(event) {
                var array = this.getSelection();
                event.onComplete = function() {
                    var prevrecid;
                    for (var i = 0; i < array.length; i++) {
                        if (array[i].recid === prevrecid) continue;
                        prevrecid = array[i].recid;
                        this.remove(prevrecid);
                    }
                    for (var i = 0; i < this.records.length; i++) {
                        this.records[i].recid = i;
                    }
                }
            }

        });
        $('#vehicles').w2render('spreadsheetVehicule');
    }

    activateOptionale(e) {
      if(e){
      e.onComplete= function(){
        var state = w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked;
        if (!state) {
            for (var i = 2; i < 20; i++) {
                w2ui.spreadsheetVehicule.hideColumn(`anv_${i}_1`);
                w2ui.spreadsheetVehicule.hideColumn(`anv_${i}_2`);
            }
        } else {
            for (var i = 2; i < 20; i++) {
                w2ui.spreadsheetVehicule.showColumn(`anv_${i}_1`);
                w2ui.spreadsheetVehicule.showColumn(`anv_${i}_2`);
            }
        }
      }
    }else{
      var state = w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked;
      if (!state) {
          for (var i = 2; i < 20; i++) {
              w2ui.spreadsheetVehicule.hideColumn(`anv_${i}_1`);
              w2ui.spreadsheetVehicule.hideColumn(`anv_${i}_2`);
          }
      } else {
          for (var i = 2; i < 20; i++) {
              w2ui.spreadsheetVehicule.showColumn(`anv_${i}_1`);
              w2ui.spreadsheetVehicule.showColumn(`anv_${i}_2`);
          }
      }
    }
        // w2ui.spreadsheetVehicule.columns
    }

    loadData(e) {
        var self = this;
        // var options = {
        // 	  rowHeaders: true,
        //         colHeaders: true,
        //         minSpareRows: 1,
        //         contextMenu: true,
        //         beforeValidate :self.beforeValidate.bind(self)
        //     };
        $.ajax({
            url: app.baseUrl + '/civutils/getdateciv',
            type: 'POST',
            data: {
                id_tvv: $('#versiune').data('selected').id,
                id_extensie: $('#extensie').data('selected').id
            },
            success: function(response) {
                var data = response.data;
                var columns = [],
                    records = [];
                for (var i = 0; i < data.colHeaders.length; i++) {
                    var editOptions = data.columns[i].editor;
                    var editor;

                    if (editOptions) {
                        if (data.columns[i].data === 'culoare') {
                            editor = {
                                type: 'combo'
                            }
                        } else {
                            editor = {
                                type: editOptions === 'select' ? 'select' : 'text',
                            }
                        }
                        if (data.columns[i].selectOptions) {
                            editor.items = [];
                            for (var x = 0; x < data.columns[i].selectOptions.length; x++) {
                                editor.items.push({
                                    id: data.columns[i].selectOptions[x],
                                    text: data.columns[i].selectOptions[x]
                                });
                            }
                        }
                    } else if (data.columns[i].type) {
                        editor = {
                            type: 'float'
                        };
                        if (data.columns[i].interval) {
                            editor.min = Number(data.columns[i].interval[0]);
                            editor.max = Number(data.columns[i].interval[1]);
                        }
                    } else {
                        editor = {
                            type: 'text'
                        };
                    }


                    columns.push({
                        field: data.columns[i].data,
                        caption: data.colHeaders[i],
                        sortable: true,
                        size: data.columns[i].data.search('anv') !== -1 || data.columns[i].data.search('vin') !== -1 ? '230px' : data.columns[i].data.search('culoare') !== -1 ? '150px' : '100px',
                        editable: editor
                    });
                }
                data.data.recid = 0;
                records.push(data.data);

                if (w2ui.hasOwnProperty('spreadsheetVehicule')) {
                    w2ui.spreadsheetVehicule.columns = columns;
                    w2ui.spreadsheetVehicule.records = records;
                    w2ui.spreadsheetVehicule.refresh();
                }
                self.activateOptionale();
            }
        });

    }

    buildLoad() {
        var self = this;
        $('#wvta').w2field('list', {
            url: app.baseUrl + '/civutils/getWVTA',
            minLength: 0,
            cascadeTo: ['#extensie']
        });
        $('#wvta').w2field().setItemById();
        $('#wvta').on('change', function() {
            $('#wvta').w2field().cascadeTo(['#extensie'])
        });

        $('#extensie').w2field('list', {
            cascadeTo: ['#tip'],
            url: app.baseUrl + '/civutils/getExtensiiWVTA',
            minLength: 0,
            cascadeData: function() {
                return {
                    id_wvta: $('#wvta').data('selected').id
                };
            }
        });
        $('#extensie').w2field().setItemById();
        $('#extensie').on('change', function() {
            $('#extensie').w2field().cascadeTo(['#tip'])
        });

        $('#tip').w2field('list', {
            cascadeTo: ['#varianta'],
            url: app.baseUrl + '/civutils/gettipuri',
            minLength: 0,
            cascadeData: function() {
                return {
                    id_extensie: $('#extensie').data('selected').id
                };
            }
        });
        $('#tip').w2field().setItemById();
        $('#tip').on('change', function() {
            $('#tip').w2field().cascadeTo(['#varianta'])
        });

        $('#varianta').w2field('list', {
            cascadeTo: ['#versiune'],
            url: app.baseUrl + '/civutils/getvariante',
            minLength: 0,
            cascadeData: function() {
                return {
                    id_wvta: $('#wvta').data('selected').id,
                    tip: $('#tip').data('selected').id
                };
            }
        });
        $('#varianta').w2field().setItemById();
        $('#varianta').on('change', function() {
            $('#varianta').w2field().cascadeTo(['#versiune'])
        });
        $('#versiune').w2field('list', {
            url: app.baseUrl + '/civutils/getversiuni',
            minLength: 0,
            cascadeData: function() {
                return {
                    id_wvta: $('#wvta').data('selected').id,
                    varianta: $('#varianta').data('selected').id,
                    tip: $('#tip').data('selected').id
                };
            }
        });
        $('#versiune').on('change', function() {
            self.loadData();
        });
    }

    validator(value, callback) {
        callback(true);
    }

    beforeValidate(value, row, prop, source) {
        var interval = this.validators[prop];
        var col = this.hot.propToCol(prop);
        var totalRows = this.hot.countRows();
        if (row < totalRows - 1) {
            if (interval) {
                if (value && value != '' && value >= Number(interval[0]) && value <= Number(interval[1])) {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                } else {
                    if (!value || value === '')
                        $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare obligatorie!');
                    else
                        $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare intre ' + interval[0] + ' si ' + interval[1]);
                    this.isValid = false;
                }
            } else if (prop === 'vin') {
                if (!this.validateVin(value)) {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare invalida!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }

            } else if (prop === 'an') {
                if (value < 1960 || value > new Date().getFullYear()) {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare invalida!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }
            } else {
                if (!value || value === '') {
                    $(this.hot.getCell(row, col)).attr('id', 'field' + row + '-' + col).w2tag('Valoare obligatorie!');
                    this.isValid = false;
                } else {
                    $(this.hot.getCell(row, col)).w2tag();
                    this.isValid = true;
                }
            }
        }
    }

    validateRow(row, rowindex) {
        var valid = true;
        var grid = w2ui.spreadsheetVehicule;
        var columns = grid.columns;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            //var cell = grid.getCellHTML(rowindex,i);
            if (!row[column.field] || row[column.field] === '') {
                $(`#grid_spreadsheetVehicule_data_${rowindex}_${i}`).w2tag('Camp obligatoriu', {
                    'class': 'w2ui-error'
                });
                valid = false;
            }
            if (column.field === 'vin') {
                valid = this.validateVin(row['vin']);
                if (!valid)
                    $(`#grid_spreadsheetVehicule_data_${rowindex}_${i}`).w2tag('Valoare incorecta', {
                        'class': 'w2ui-error'
                    });
            }
        }
        return valid;
    }

    saveData() {
        var cansave = true;
        var self = this;
        var array = w2ui.spreadsheetVehicule.records;
        self.isValid = true;
        for (var i = 0; i < array.length; i++) {
            if (!self.validateRow(array[i], i)) self.isValid = false;
        }
        if (!self.isValid) {
            var opt = {
                text: 'Vehiculele contin erori!',
                title: 'Notificare',
                type: 'error-template'
            };
            Util.showNotification(opt);
            return;
        }
        var postData = {
            id_tvv: $('#versiune').data('selected').id,
            id_extensie: $('#extensie').data('selected').id,
            id_comanda: self.options.id_comanda,
            data: w2ui.spreadsheetVehicule.records,
            optionale:w2ui.spreadsheetVehicule.toolbar.get('anvoptionale').checked
        }
        if (cansave && self.isValid) {
            $('#validationSummary').empty();
            $.ajax({
                url: app.baseUrl + '/civutils/saveVehiculeExcel',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(postData),
                success: function(response) {
                    if (response.errors.length === 0) {
                        $('#validationSummary').empty();
                        var opt = {
                            text: 'Vehiculele au fost adaugate!',
                            title: 'Notificare',
                            type: 'success-template'
                        };
                        Util.showNotification(opt);
                    } else {
                        var opt = {
                            text: 'Vehiculele contin erori!',
                            title: 'Notificare',
                            type: 'error-template'
                        };
                        Util.showNotification(opt);

                        response.errors.map(function(error) {
                            for (var err in error) {
                                $('#validationSummary').append('<span>' + err + ': ' + error[err] + '</span><br>');
                            }
                        });
                        response.goodVehicles.map(function(vin) {
                            var rows = w2ui.spreadsheetVehicule.records;
                            for (var row = 0; row <= rows.length; row++) {
                                if (rows[row].vin === vin) {
                                    w2ui.spreadsheetVehicule.remove(rows[row].recid);
                                }
                            }
                        });

                    }
                },
                error: function(data) {
                    data.map(function(err) {
                        $('#validationSummary').append('<span>' + err + ': ' + data[err] + '</span><br>');
                    });
                }
            });
        } else {
            //w2alert('datele nu sunt valide!');
        }
    }

    validateVin(value, source) {
        var vin = value; //.toUpperCase();
        var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
        //var wild = /^$/;

        if (vin !== undefined && vin.length > 0) {
            if (regex.test(vin) && vin.length === 17) {
                //app.Util.removeError($('#vin').parent());
                return true;
                //}else if(wild.test(vin)){

            } else {
                return false;
            }
        }
    }

    onBeforeDetach() {
        w2ui.spreadsheetVehicule.destroy();
    }
}
