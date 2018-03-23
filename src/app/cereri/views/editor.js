export default class EditorView extends Mn.FormView{
	constructor(props) {
		super(props);
		this.template = require('./../templates/editor.html');
		this.panelID = `cerere${this.model.id}`;
		const fields = typeof this.model.fields === 'function'? this.model.fields() : this.model.fields;
		for (var f in fields) {
                var field = fields[f];
                this.bindings[field.el] = field.name;
            }
        this.bindings['#date_beneficiar_container'] = {
        	observe:'id',
        	visible:()=>{return app.User.isInRole([1,10]);}
        };
	}

	show() {
		var self = this;
		if (this.model.id) {
            this.model.fetch().then(function() {
                self.cachedModel = self.model.toJSON();
                self.open();
            });
        } else {
            self.isNew = true;
            self.open();
        }
    }

    open(){
    	var self = this;
        this.panel = $.jsPanel({
        	// panelType:'modal',
            headerTitle: 'Cerere',
            id: self.panelID,
            theme: '#1356A9',
            resize:( event, ui ) => {
            	w2ui[self.panelID].resize();
            },
            contentSize: "440 255",
            headerControls: { smallify: 'remove' },
            content: self.render().el,
            onclosed: self.destroyHandler.bind(self),
            callback: self.initHandler.bind(self)
        });
    }

      /* handles the close event of the panel. we destroy the view here */
    destroyHandler() {
        app.trigger('app:cerere:edited');
        w2ui[this.panelID].destroy();
        this.destroy();
    }

    /* handles the view creation - here we setup our elements, model bindings, etc */
    initHandler() {
        var self = this;
        this.$el.w2form({
            name: self.panelID,
            fields: self.model.fields(),
            record: self.model.toJSON(),
            actions: {
                cancel: function() {
                    this.clear();
                    self.panel.close();
                },
                save: self.saveHandler.bind(self)
            }
        });
        this.stickit();
    }

    saveHandler(){
    	// console.log(w2ui[this.panelID].validate());
			if(app.User.isInRole([4])){
				this.model.set('depusaderar',0);
			}else{
				this.model.set('depusaderar',1);
			}
    	 var self = this,
            options;
        options = {
            success: function(model) {
                model.set('recid', model.id);
                if (self.isNew) {
                    app.trigger('app:grid:added', {
                        grid: 'gridCereri',
                        model: model.toJSON()
                    });
                } else {
                    app.trigger('app:grid:edited', {
                        grid: 'gridCereri',
                        model: model.toJSON()
                    });
                }
                self.panel.close();
                //success message is handled on app eventhandler
            },
            error: function(model, response) {
                var data, opt = {
                    text: 'Eroare la salvare!',
                    title:'Notificare',
                    type: 'error-template'
                };
                data = eval('(' + response.responseText + ')');
                //w2utils.validateRaw(self.$el, data.data);
            }
        };
        if (w2ui[this.panelID].validate().length === 0 ) {
             self.model.save({}, options);
            console.log(self.model.toJSON());
        }
    }
}
