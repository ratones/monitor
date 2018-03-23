import Util from './../../util';
export default class CereriView extends Mn.View {
    constructor(props) {
        let local = $.extend(props, {
            className: 'fullscreen'
        });
        super(local);
        this.template = require('./../templates/plati.html');
    }
    onAttach() {
        var self = this;
        var dt = new Date();

        dt.setDate(1); // going to 1st of the month
        dt.setHours(-1);
        var lDay = dt.getDate().pad();
        var prevMonth = Number((dt.getMonth() + 1)).pad();
        var year = dt.getFullYear();

        var fDate = self.fdate = '01.' + prevMonth + '.' + year;
        var lDate = self.lDate = lDay + '.' + prevMonth + '.' + year;
        $('#grid').w2groupedgrid({
            name: 'testgrid',
            url: app.baseUrl + '/comenzi/getSituatiePlati',
            recid: 'id',
            //groupData:['client'],
            summaryData: {
                gridSummary: [{
                    field: 'client',
                    summary: 'count'
                }, {
                    field: 'suma',
                    summary: 'sum'
                }, {
                    field: 'nrbuc',
                    summary: 'sum'
                }]
            },
            show: {
                footer: true,
                toolbar: true
            },
            toolbar: {

                items: [
                    {
                        type: 'button',
                        disabled: false,
                        caption: 'Excel',
                        icon: 'w2ui-icon-file',
                        id: 'btnExcel',
                        onClick: function(event) {
                           self.exportxls();
                        }
                    },
                    {
                        type: 'break'
                    },
                    {
                        type: 'button',
                        id: 'btnRaport',
                        caption: 'Raport',
                        icon: 'w2ui-icon-print',
                        disabled:false,
                        onClick: function(e) {
                            self.printRaport();
                        }
                    }
                ]
            },
            columns: [{
                    field: 'client',
                    caption: 'Beneficiar',
                    size: '350px',
                    sortable: true
                }, {
                    field: 'id',
                    caption: 'Nr.Comanda',
                    size: '150px',
                    sortable: true
                }, {
                    field: 'nr_factura',
                    caption: 'Nr factura',
                    size: '220px',
                    sortable: true
                }, {
                    field: 'serie_factura',
                    caption: 'Serie factura',
                    size: '120px',
                    sortable: true
                }, {
                    field: 'data_factura',
                    caption: 'Data factura',
                    size: '120px',
                    sortable: true
                }, {
                    field: 'nrbuc',
                    caption: 'Numar bucati',
                    size: '200px',
                    sortable: true
                }, {
                    field: 'suma',
                    caption: 'Suma incasata',
                    size: '30%',
                    sortable: true
                }

            ],
            groupTemplates: [{
                field: 'client',
                render: (rec) => {
                    return `<b>${rec.client}(Count: ${rec.grpcnt})</b>`
                }
            }, {
                field: 'serie_factura',
                render: (rec) => {
                    return `<b>${rec.serie_factura}(Count: ${rec.grpcnt})</b>`
                }
            }],
            summaryTemplates: [{
                field: 'client',
                render: (rec) => {
                  if(rec)
                    return `<b>Total: ${rec.client}</b>`
                }
            }, {
                field: 'suma',
                render: (rec) => {
                  if(rec)
                    return `<b>Total: ${rec.suma} lei</b>`
                }
            }, {
                field: 'nrbuc',
                render: (rec) => {
                  if(rec)
                    return `<b>Total: ${rec.nrbuc} CIV</b>`
                }
            }],
            searchData: [
                 {field: "data_factura", type: "date", operator: "between", value: [fDate, lDate]}
            ],
            hasInitialSearchData: true,
            onAdd: () => {
                console.log(w2ui.grptestgrid.getSelection());
            },
            parser: function(response) {
                var data = JSON.parse(response);
                var result = {
                    status: 'success',
                    records: data.rows,
                    summary: data.summary || [],
                    total: data.records
                };
                return result;
            },
            multiSearch: true,
            searches: [
                 {
                    field: 'client',
                    caption: 'Beneficiar',
                    type: 'text'
                },
                {
                    field: 'id',
                    caption: 'Nr.Comanda ',
                    type: 'int'
                },
                {
                    field: 'data_factura',
                    caption: 'Data factura',
                    type: 'date'
                }
            ],
            onSelect: (data) => {
                //data.onComplete = ()=>{

                //};

            },
            records: [{
                "recid": 1,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }, {
                "recid": 2,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827"
            }, {
                "recid": 3,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 4,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 5,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750"
            }, {
                "recid": 6,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }, {
                "recid": 7,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827",
                "style": "background-color: #C2F5B4"
            }, {
                "recid": 8,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 9,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 10,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750",
                "style": "color: red"
            }, {
                "recid": 11,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809",
                "style": "background-color: #FBFEC0"
            }, {
                "recid": 12,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827"
            }, {
                "recid": 13,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 14,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 15,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750",
                "style": "color: blue"
            }, {
                "recid": 16,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }, {
                "recid": 17,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827"
            }, {
                "recid": 18,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 19,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 20,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750"
            }, {
                "recid": 21,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }, {
                "recid": 22,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827"
            }, {
                "recid": 23,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 24,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 25,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750",
                "style": "color: gray"
            }, {
                "recid": 26,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }, {
                "recid": 27,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827"
            }, {
                "recid": 28,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 29,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 30,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750"
            }, {
                "recid": 31,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }, {
                "recid": 32,
                "fname": "Ludwig Van",
                "lname": "Beethoven",
                "sdate": "1770-1827",
                "style": "background-color: #C2F5B4"
            }, {
                "recid": 33,
                "fname": "Wolfgang Amadeus",
                "lname": "Mozart",
                "sdate": "1756-1791"
            }, {
                "recid": 34,
                "fname": "Johann Sebastian",
                "lname": "Bach",
                "sdate": "1685-1750"
            }, {
                "recid": 35,
                "fname": "Richard",
                "lname": "Wagner",
                "sdate": "1685-1750"
            }, {
                "recid": 36,
                "fname": "Joseph",
                "lname": "Haydn",
                "sdate": "1732-1809"
            }]
        });
        // this.$el.w2layout({
        //     name: self.mainLayoutName,
        //     panels: [{
        //         type: 'main',
        //         content: `<div id="mainGrid${self.cid}"></div>`
        //     }, {
        //         type: 'bottom',
        //         size: 30,
        //         content: '<div id="footer"></div>'
        //     }]
        // });
        // self.buildToolbar();
        // w2ui[self.mainLayoutName].showToolbar('main');
        // w2ui[self.mainLayoutName].assignToolbar('main', self.toolbar);
    }
    exportxls(){
        var grid = w2ui['grptestgrid'].mainGrid;
        var post = {
            cmd:'get-xls',
            limit:35000,
            offset:0,
            search:grid.searchData,
            searchLogic:"AND"
        };

        $('#dialog').trigger('click');
          $('#dialog').off('change').on('change', function (event) {
            Util.downloadFile(grid.url,'POST',post,$(this).val());
            $(this).val('');
          });
     }
     printRaport(id){
        var self = this;
        var grid = w2ui['grptestgrid'].mainGrid;
        var post = {
            cmd:'get-xls',
            limit:35000,
            offset:0,
            search:grid.searchData,
            searchLogic:"AND"
        };
        Util.printPDF(app.baseUrl + '/comenzi/GetRaportPlati?data='+JSON.stringify(post));
    }
    onBeforeDestroy() {
        w2ui['grptestgrid'].destroy();
    }
}
