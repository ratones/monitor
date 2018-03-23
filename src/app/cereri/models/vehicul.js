export default class VehiculModel extends Backbone.SModel {
    constructor(options) {
        let local = $.extend(options, {
            defaults: {
                canBeDirty: true
            }
        })
        super(local);
        this.urlRoot = app.baseUrl + '/vehicule/edit';
    }
    fields() {
        const self = this;
        const data = [];
        if (self.get('culoare')) {
            $(self.get('culoare').split('-')).each(function() {
                data.push({
                    id: this,
                    text: this
                });
            });
        }
        return [{
                name: 'Atribute',
                type: 'collection'
            }, {
                name: 'Anvelope',
                type: 'collection'
            }, {
                el: '#vin',
                name: 'vin',
                type: 'text',
                required: true

            }, {
                el: '#cnot',
                name: 'cnot',
                type: 'text'
            }, {
                el: '#nr_registru',
                name: 'nr_registru',
                type: 'text'
            }, {
                el: '#wvta',
                name: 'id_wvta',
                type: 'list',
                required: true,
                options: {
                    url:app.baseUrl + '/civutils/getWVTA',
                    cascadeTo: ['#id_extensie', '#tip', '#varianta', '#versiune'],
                    selected: self.get('id_wvta'),
                    minLength:0
                }
            }, {
                el: '#id_extensie',
                name: 'id_extensie',
                type: 'list',
                required: true,
                options: {
                    minLength: 0,
                    url: app.baseUrl + '/civutils/getExtensiiWVTA',
                    cascadeData: function() {
                        return {
                            id_wvta: self.get('id_wvta') || '0'
                        };
                    },
                    selected:self.get('id_extensie'),
                    cascadeTo: ['#tip', '#varianta', '#versiune']
                }
            }, {
                el: '#tip',
                name: 'tip',
                type: 'list',
                required: true,
                options: {
                    minLength: 0,
                    url:app.baseUrl + '/civutils/getTipuri',
                    cascadeData: function() {
                        return {
                            id_extensie: self.get('id_extensie') || '0'
                        };
                    },
                    selected:self.get('tip'),
                    cascadeTo: ['#varianta', '#versiune']
                }
            }, {
                el: '#varianta',
                name: 'varianta',
                type: 'list',
                required: true,
                options: {
                    minLength: 0,
                    url: app.baseUrl + '/civutils/getVariante',
                    cascadeData: function() {
                        return {
                            id_wvta: self.get('id_wvta') || '0',
                            tip: self.get('tip')
                        };
                    },
                    cascadeTo: ['#versiune']
                },
                selected: self.get('varianta'),
            }, {
                el: '#versiune',
                name: 'versiune',
                type: 'list',
                required: true,
                options: {
                    minLength: 0,
                    url: app.baseUrl + '/civutils/getVersiuni',
                    cascadeData: function() {
                        return {
                            id_wvta: self.get('id_wvta') || '0',
                            tip: self.get('tip'),
                            varianta: self.get('varianta')
                        };
                    }
                },
                selected: {
                    id: self.get('id_tvv'),
                    text: self.get('versiune')
                },
                change: function() {
                    var selected = $('#versiune').data('selected');
                    self.set('versiune', selected.text);
                    self.set('id_tvv', selected.id);
                }
            }, {
                el: '#an_fabr',
                name: 'an_fabr',
                type: 'int',
                required: true,
                options: {
                    min: 1960,
                    max: Number(new Date().getFullYear())
                }
            }, {
                el: '#motor',
                name: 'motor',
                type: 'list',
                required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R',
                options: {
                    url: app.baseUrl + '/vehicule/getMotoare',
                    cascadeData: function() {
                        return {
                            id_tvv: self.get('id_tvv'),
                            id_extensie: self.get('id_extensie')
                        };
                    },
                    minLength: 0
                },
                selected: self.get('motor'),
            },
            /*{
                   el: '#serie_motor',
                   name: 'serie_motor',
                   type: 'text',
                   required: true

               },*/
            {
                el: '#culoare',
                name: 'culoare',
                type: 'enum',
                required: true,
                options: {
                    minLength: 0,
                    url: app.baseUrl + '/vehicule/getcolors',
                    // cascadeData: function() {
                    //     return {
                    //         nr_registru: self.get('nr_registru'),
                    //         ext: self.get('extensie')
                    //     };
                    // },
                    openOnFocus: true,
                    max: 3
                },
                selected: data
            }, {
                el: '#serie_motor',
                name: 'serie_motor',
                type: 'text',
                required: self.get('categ_euro') && self.get('categ_euro').substr(0, 1) !== 'O' && self.get('categ_euro').substr(0, 1) !== 'R'
            }
        ];
    }
}
