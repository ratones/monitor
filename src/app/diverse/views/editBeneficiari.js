export default class EditBeneficiari extends Mn.View {
    constructor(props) {
        const options = $.extend(props, {
          events:{
            'click #btnSave':'saveHandler',
            'click #btnCancel':'close'
          }
        });

        super(options);
        this.template = require('./../templates/editBeneficiari.html');

        this.bindings = {};
        this.fields = typeof this.model.fields === 'function' ? this.model.fields() : this.model.fields;
        for (var i in this.fields) {
            var field = this.fields[i];
            this.bindings[field.el] = field.name;
        }
        if (this.model.id) {
            this.model.fetch();
        } else {
            this.isNew = true;
        }

        this.winOptions = {
            width: '550px',
            height: '650px',
            name: 'editorBeneficiari',
            title: 'Editor Beneficiari',
            buttons:`<button class="w2ui-btn w2ui-btn-blue"  id="btnSave" name="save">Salveaza</button>
            <button class="w2ui-btn w2ui-btn-red" id="btnCancel" name="cancel">Renunta</button>`
        };
    }

    onAttach() {
        var self = this;
        $('#formBeneficiari').w2form({
            name: 'formBeneficiari',
            fields: self.fields,
            record: self.model.toJSON(),
            actions: {
                cancel: function() {
                    this.clear();
                    self.win.close();
                },
                save: self.saveHandler.bind(self)
            }
        });
        this.stickit();
    }
    onBeforeDestroy() {
        if (w2ui.hasOwnProperty('formBeneficiari')) {
            w2ui.formBeneficiari.destroy();
        }
    }
    close(){
      this.win.close();
    }
    saveHandler() {
        if(w2ui.formBeneficiari.validate().length === 0){
          var self = this;
          var options = {
            //se ruleaza la salvarea cu succes
              success: function(model) {
                  self.win.close();
                  model.set('recid', model.id);
                  if (self.isNew) {
                     //daca este nou, declansam eveniment in applicatie care insereaza modelul salvat in grid
                      app.trigger('app:grid:added', {
                          grid: 'gridBeneficiari',
                          model: model.toJSON()
                      });
                  } else {
                     //daca este editat, declansam un eveniment in aplicatie care actualizeaza proprietatile modificate ale modelului in grid
                      app.trigger('app:grid:edited', {
                          grid: 'gridBeneficiari',
                          model: model.toJSON()
                      });
                  }
              },
              //se ruleaza la eroare la salvare
              error:function(){
                var data, opt = {
                    text: 'Eroare la salvare!',
                    title:'Notificare',
                    type: 'error-template'
                };
                app.trigger('app:show:notification',opt);
              }
          };
          this.model.save({},options);
          this.win.close();
        }
    }
}
