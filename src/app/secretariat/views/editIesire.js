export default class EditIesire extends Mn.View {
  constructor(props) {
    const options = $.extend(props,{
      events:{
        'click #btnSave':'saveHandler',
        'click #btnCancel':'closeHandler'
      }
    });

    super(options);
    this.template = require('./../templates/editiesire.html');
    this.bindings = {};
    this.fields = typeof this.model.fields === 'function'?this.model.fields():this.model.fields;
    for(var i in this.fields){
      var field = this.fields[i];
      this.bindings[field.el] = field.name;
    }
    if(this.model.id){
      this.model.fetch();
    }else{
      this.isNew = true;
    }
    this.winOptions={
      width:'550px',
      height:'650px',
      name:'editorIesire',
      title:'Editor Iesire',
      buttons:`<button class="w2ui-btn w2ui-btn-blue" id="btnSave" name="save">Salveaza</button>
               <button class="w2ui-btn w2ui-btn-red" id="btnCancel" name="cancel">Renunta</button>`
    };
  }

  onAttach(){
    var self = this;
     $('#formIesire').w2form({
       name:'formIesire',
       fields:self.fields,
       record:self.model.toJSON(),
      //  actions: {
      //      cancel: function() {
      //          this.clear();
      //          self.win.close();
      //      },
      //      save: self.saveHandler.bind(self)
      //  }
     });
    //  w2ui.formIesire.resize();
    //  this.win.resize();
      this.stickit();
  }

  onBeforeDestroy(){
    if(w2ui.hasOwnProperty('formIesire'))
      w2ui.formIesire.destroy();
  }
  saveHandler(){
    if (w2ui['formIesire'].validate().length === 0) {
        var self = this;
        var options = {
            success: function(model) {
                self.win.close();
                model.set('recid', model.id);
                if (self.isNew) {
                    app.trigger('app:grid:added', {
                        grid: 'gridIesiri',
                        model: model.toJSON()
                    });
                } else {
                    app.trigger('app:grid:edited', {
                        grid: 'gridIesiri',
                        model: model.toJSON()
                    });
                }
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
        this.model.save({},options);
      }
  }

  closeHandler(){
    this.win.close();
  }
}
