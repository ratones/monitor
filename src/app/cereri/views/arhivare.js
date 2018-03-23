import Collection from './../collections/vehiculeciv';
import Model from './../models/vehiculciv';
export default class ArhivareView extends Mn.View {
    constructor(props) {
        const local = $.extend(props, {
            className: 'fullscreen w2ui-form ',
            attributes:()=>{
              return {style:'overflow:auto !important'}
            },
            events: {
                'click #btnSave': 'arhivare',
                'click #btnClose': 'closeView',
                'click #btnNext': 'next',
                'click #btnPrev': 'prev',
                'click #btnLast': 'last',
                'click #btnFirst': 'first',
                'keyup #serieciv': 'gotofolie',
                'blur #serieciv': 'gotofolie',
                'keyup #vin': 'lookup',
                'blur #vin': 'lookup',
                'keyup #folie_civ': 'gotosave'
            }
        });
        super(local);
				this.bindings={};
        this.template = require('./../templates/arhivare.html');
    }
    show() {
        this.collection = new Collection(this.options.data);
        this.model = this.collection.models[0];
        this.open();
    }

    open() {
        var self = this;
        this.win = $.jsPanel({
            id: 'civReportArhivare',
            headerTitle: 'Arhivare CIV',
            theme: '#1356A9',
						content:self.render().el,
            contentSize: '1020 850',
            callback: function(event) {
							  //this.maximize();
                $('#totalciv').text(self.collection.models.length);
                $('input[type=text][readonly]').css({
                    'background-color': 'yellow',
                    'color': 'black'
                });
                $('textarea[readonly]').css({
                    'background-color': 'yellow',
                    'color': 'black'
                });
                self.setupView.apply(self,[true]);
                if (self.model.get('serie_civ')) {
                    $('#folie_civ').focus();
                } else {
                    $('#serieciv').focus();
                }
            },
            onClosed: function(event) {
                self.destroy();
            }
        });
        // this.win.toolbarAdd('footer',function(footer){
        //   return $('#buttons').html();
        // });
    }

    rebaseIndex() {
        this.collection.models.map(function(model, i) {
            model.set('currentIndex', i + 1);
        });
    }

    setupView(link) {
        if (!link)
            this.unstickit();
        var self = this;
        var mentiuni = '';
        if (link) self.rebaseIndex();
        if (this.model) {
            //this.model.set('currentIndex',this.collection.models.indexOf(this.model)+1);
            this.model.get('Modificari').map(function(mod) {
                mentiuni += mod.modificare + '\n';
            });
            this.model.set('mentiuni', mentiuni);
            //this.model.unset('folie_civ');
            for (var field in this.model.attributes) {
                self.bindings['#' + field] = field;
            }
            $('#btnSave').attr('disabled', null);
        } else {
            this.model = new Model();
            $('#btnSave').attr('disabled', true);
        }
        $('#vin').val(this.model.get('nr_identif'));
        $('#serieciv').val(this.model.get('serie_civ'));
        //if(link)
        this.stickit();
    }

    next(e, del) {
        var self = this;
        if (del && this.collection.models.length === 1) {
            this.collection.remove(this.model);
            this.model = null;
            $('#totalciv').text(this.collection.models.length);
            this.setupView();
            w2alert('Nu mai sunt civ-uri de arhivat!');
        }
        if (this.model.get('currentIndex') < this.collection.models.length) {
            if (del) {
                var currmodel = this.model;
            }
            var nextindex = this.model.get('currentIndex') + 1;
            this.model = this.collection.find(function(model) {
                return model.get('currentIndex') === nextindex;
            });
            if (del) {
                this.collection.remove(currmodel);
                this.rebaseIndex();
                if (this.model.get('serie_civ')) {
                    $('#folie_civ').focus();
                } else {
                    $('#serieciv').focus();
                }
                $('#totalciv').text(this.collection.models.length);
            }
            this.setupView();
        }
    }

    prev() {
        var self = this;
        if (this.model.get('currentIndex') > 1) {
            var nextindex = this.model.get('currentIndex') - 1;
            this.model = this.collection.find(function(model) {
                return model.get('currentIndex') === nextindex;
            }); //this.collection.models[this.model.get('currentIndex')-1];
            this.setupView();
        }
    }

    last() {
        this.model = this.collection.models[this.collection.length - 1];
        this.setupView();
    }

    first() {
        this.model = this.collection.models[0];
        this.setupView();
    }

    search(field, value) {
        console.log('searching for ' + value + ' in ' + field);
        var newmodel = this.collection.find(function(model) {
            return model.get(field) === value;
        })
        if ((newmodel && field === 'serie_civ') || field === 'nr_identif') {
            this.model = newmodel;
            this.setupView();
        } else if (!newmodel && field === 'serie_civ') {
            this.model.set('serie_civ', value);
        }
    }
    lookup(e) {
        if ((e.which && e.which === 13) || !e.which) {
            this.search('nr_identif', $('#vin').val().toUpperCase());
        }
    }
    arhivare() {
        var self = this;

        $.ajax({
            url: app.baseUrl + '/vehicule/arhivareciv',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(self.model.toJSON()),
            dataType: 'json',
            success: function(data) {
                self.next(null, true);
            },
            error: function(data) {
                console.log(data.responseJSON);
                w2alert(data.responseJSON.message);
            }
        });

    }

    gotofolie(e) {
        var myString = $('#serieciv').val().toUpperCase();
        if (!myString) return;
        if ((e.which && e.which === 13) || !e.which) {
            $('#serieciv').val(myString);
            var myRegexp = /([A-Z])(-)([0-9]{6})/;
            var match1 = myRegexp.exec(myString);
            if (!match1) {
                var myRegexp = /([A-Z])([0-9]+)/;
                var match2 = myRegexp.exec(myString);
                if (!match2) {
                    alert('Seria CIV nu este introdusa corect!');
                    $('#serieciv').focus();
                } else {
                    var sc = match2[1] + '-' + match2[2];
                    $('#serieciv').val(sc);
                    this.search('serie_civ', sc);
                    $('#folie_civ').focus();
                }
            } else {
                this.search('serie_civ', myString);
                $('#folie_civ').focus();
            }
        }
    }

    gotosave(e) {
        if (e.which === 13) {
            $('#btnSave').focus();
        }
    }

    closeView(e) {
        this.win.close();
    }
}
