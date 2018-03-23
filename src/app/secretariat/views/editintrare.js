export default class EditIntrare extends Mn.PanelView {
    constructor(props) {
        var options = $.extend(props, {
            ui: {
                'repartizare': '#alegeRepartizare',
                'save': '#btnSave',
                'cancel': '#btnCancel'
            },
            events: {
                'click @ui.repartizare': 'openOverlay',
                'click @ui.save': 'saveHandler',
                'click @ui.cancel': 'close',
            }
        });
        super(options);
        this.coordonatori = [];
        this.idRepartizare = [];
        this.template = require('./../templates/editintrare.html');
        this.panelID = `cerere${this.model.id}`;
        this.winOptions = {
            name: this.panelID,
            width: '550px',
            height: '720px',
            modal: true,
            isModal: true,
            showClose:false,
            title: 'Edit Intrare',
            buttons:`<button class="w2ui-btn w2ui-btn-blue" id="btnSave" name="save">Salveaza</button>
                    <button class="w2ui-btn w2ui-btn-red" id="btnCancel" name="cancel">Renunta</button>`
        };
        //daca avem id pt model, il aducem de pe server
        if (this.model.id) {
            this.model.fetch();
        } else {
            self.isNew = true;
        }
        this.bindings = {};
        const fields = typeof this.model.fields === 'function' ? this.model.fields() : this.model.fields;
        for (var f in fields) {
            var field = fields[f];
            this.bindings[field.el] = field.name;
        }
        $.extend(this.bindings, {
            '[name="tip"]': {
                observe: 'tip',
                onGet: function(value) {
                    console.log('tip:' + value);
                    return value === 2 || value === 9 ? 2 : value;
                }
            }
        });
    }

    close(){
      this.win.close();
    }
    onAttach() {
        var self = this;
        $('#editIntrare').w2form({
            name: 'intrareForm',
            fields: self.model.fields(),
            record: self.model.toJSON()
        });
        this.stickit();
    }

    onBeforeDestroy() {
        app.trigger('app:intrare:edited');
        if (w2ui.hasOwnProperty('intrareForm'))
            w2ui['intrareForm'].destroy();
        // this.destroy();
    }
    saveHandler() {
        if (w2ui['intrareForm'].validate().length === 0) {
            var self = this;
            var options = {
                success: function(model) {
                    self.win.close();
                    model.set('recid', model.id);
                    if (self.isNew) {
                        app.trigger('app:grid:added', {
                            grid: 'gridIntrari',
                            model: model.toJSON()
                        });
                    } else {
                        app.trigger('app:grid:edited', {
                            grid: 'gridIntrari',
                            model: model.toJSON()
                        });
                    }
                    self.idRepartizare = [];
                },
                error:function(){
                  var data, opt = {
                      text: 'Eroare la salvare!',
                      title:'Notificare',
                      type: 'error-template'
                  };
                  app.trigger('app:show:notification',opt);
                }
            };
            this.model.set('ids', self.idRepartizare);
            // console.log(this.model.toJSON());
            this.model.save({},options);
        }
    }
    openOverlay() {
        var self = this;
        var html = '<div style="height:300px">';
        $.ajax({
            url: app.Secretariat.baseUrl + 'utils/getcoordonatori',
            success: function(response) {
                var data = response.items;
                self.coordonatori = data;
                html += '<ul style="list-style:none">';
                for (var key in data) {
                    html += '<li>' +
                        '<input type="checkbox" class="coord-check" id="coord-' + data[key].id + '" value="' + data[key].id + '">' +
                        '<label style="margin:4px 6px" for="coord-' + data[key].id + '">' + data[key].text + '</label>' +
                        '</li>';
                }
                html += `</ul><hr><button class="w2ui-btn w2ui-btn-blue" style="position:absolute;bottom:10px;right:20px; width:60px" id="closeCoord" onClick="$().w2overlay({ name: 'coordOverlay' })" >Ok</button></div>`;
                $('[name="repartizare"]').w2overlay({
                    html: html,
                    name: 'coordOverlay',
                    hideEl: '#closeCoord',
                    width: '300px',
                    maxHeight: '200px',
                    openAbove: true,
                    style: 'padding:10px;overflow:auto',
                    onShow: function() {
                        self.repartizare();
                    },
                    onClose: function() {
                        self.idRepartizare = [];
                    }
                });
            }
        });
    }
    repartizare(e) {
        var self = this;
        console.log('repartizare');
        var current = this.model.get('repartizare') ? this.model.get('repartizare').split(',') : [];
        for (var key in this.coordonatori) {
            for (var ind in current) {
                current[ind] = current[ind].trim();
                if (current[ind].trim() === self.coordonatori[key].text.trim()) {
                    $('#coord-' + self.coordonatori[key].id).attr('checked', 'checked');
                    self.idRepartizare.push(self.coordonatori[key].id);
                }
            }

        }
        $('.coord-check').change(function() {
            var coord = _.where(self.coordonatori, {
                id: Number($(this).val())
            });
            if ($(this).is(':checked')) {
                self.idRepartizare.push(Number($(this).val()));
                current.push(coord[0].text);
            } else {
                current = _.without(current, coord[0].text);
                self.idRepartizare.splice(_.indexOf(self.idRepartizare, Number($(this).val())), 1);
            }
            self.model.set('repartizare', current.join(','));
            $('[name="repartizare"]').val(current.join(', '));
            self.idRepartizare = _.unique(self.idRepartizare);
        });
    }
}
