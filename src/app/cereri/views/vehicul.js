import Util from './../../util';
import Globals from './../globals';
export default class VehiculView extends Mn.FormView {
  constructor(props) {
    var options = $.extend(props,{
      className:'fullscreen',
      /**
       * view related properties
       * @type {Object}
       */
      ui: {
          'save': '#btnSaveVehicul',
          'copy': '#btnCopyVehicul',
          'info': '#btnVehiculComplet',
          'back': '#btnBack',
          'newwin': '#btnNewWindow',
          'firstIndex':'#btnFirst',
          'lastIndex':'#btnLast',
          'nextIndex':'#btnNext',
          'prevIndex':'#btnPrev',
      },
      /**
       * ui event handlers
       * @type {Object}
       */
      events: {
          'click @ui.save': 'save',
          'click @ui.copy': 'copy',
          'click @ui.back': 'back',
          'click @ui.info': 'info',
          'click @ui.newwin': 'newwin',
          'click @ui.firstIndex': 'gotofirst',
          'click @ui.lastIndex': 'gotolast',
          'click @ui.nextIndex': 'gotonext',
          'click @ui.prevIndex': 'gotoprev'
      }
    });
    super(options);
    this.bindingOverrides = {
          //disable copy button for new records
          '#btnCopyVehicul': {
              attributes: [{
                  name: 'disabled',
                  observe: 'id',
                  onGet: function(value) {
                      return !value;
                  }
              }]
          },
          //disable info button for new records
          '#btnVehiculComplet': {
              attributes: [{
                  name: 'disabled',
                  observe: 'id',
                  onGet: function(value) {
                      return !value;
                  }
              }]
          },
          //hide engine for O and R categories
          '#engine_container': {
              attributes: [{
                  name: 'hidden',
                  observe: 'categ_euro',
                  onGet: function(value) {
                      if (value)
                          return (value.substr(0, 1) === 'O' || value.substr(0, 1) === 'R');
                      return value;
                  }
              }]
          },
          '#wvta':{
              observe:'id_wvta',
              onGet:function(value){
                  return value;
              },
              onSet:function(value){
                  this.resetVehicul();
                  var selected = $('#wvta').data('selected');
                  this.model.set('wvta',selected.text);
                  return value;
              }
          },
          '#versiune':{
              observe:'versiune',
              onGet:function(value){
                  return value;
              },
              onSet:function(value){
                  var selected = $('#versiune').data('selected');
                  this.model.set('id_tvv',selected.id);
                  this.reloadDate();
                  return value;
              }
          },
          '#culoare':{
            observe:'culoare',
            onGet:(value)=>{
                return value.split('-');
            },
            onSet:(value)=>{
              var color = [];
              var els = $('#culoare').data('selected');
              for (var index in els) {
                  var el = els[index];
                  color.push(el.id);
              }
              return color.join('-');
            }
          }
    };
    this.template = require('./../templates/vehicul.html');
    this.setViewType();
  }

  setViewType(){
    var isCopy = this.model.get('isCopy');
    if (!this.model.id) {
        if (!isCopy) {
            this.isNew = true;
        }
    }
  }

  resetVehicul(){
    var self = this;
    console.log(self.model.get('id_tvv'));
    for (var x = 0; x < 10; x += 1) {
        $('#ment' + (x + 1)).val('');
    }
    // if is copy we need to refresh only color and serie_motor - all others remains the same
    self.model.set('nr_registru','');
    if (!self.iscopy) {
        if (!self.isNew) {
            //not new - we nees to reset child collections
            self.model.get('Atribute').reset();
            self.model.get('Anvelope').reset();
            //try to reset the anvelope dropdown sources
            try {
                Globals.anvelopefata.reset();
                Globals.anvelopespate.reset();
            } catch (e) {
                console.error(e);
            }
        }
        // reset an fabricatie
        self.model.set('an_fabr', '');
        //get new wvta,categ euro and cnot and set them to model

        // self.model.set('motor', '');
    }
    //reset serie motor and culoare
    // self.model.set('serie_motor', '');
    // self.model.set('culoare', '');
    // reinitialize extensie dropdown
    //$('#extensie').w2field().reinit();
  }

  reloadDate(){
    var self = this;
    // we need this params to reload some data from server
    var params = {
        id_tvv: this.model.get('id_tvv'),
        id_extensie: this.model.get('id_extensie'),
        id: this.model.id && this.model.id !== 0 ? this.model.id : 0
    };
    // check if nr registru and extensie are set
    if (params.id_tvv && params.id_extensie) {
        // if not is copy we need to refresh motor dropdown
        if (!self.iscopy) {
            $.ajax({
            url: app.baseUrl + '/vehicule/getwvta',
            data: {
                id_tvv: self.model.get('id_tvv')
            },
            success: function(response) {
                self.model.set('categ_euro', response.categ_euro);
                if (response.categ_euro.substr(0, 1) !== 'O' && response.categ_euro.substr(0, 1) !== 'R') {
                        // $('#serie_motor').attr('disabled', null);
                        // $('#motor').attr('disabled', null);
                        $('#engine_container').show();
                        $('#motor').w2field().reinit();
                        self.model.set('serie_motor', '').set('motor', '');
                    } else {
                        console.log("Remorca!!");
                        // $('#serie_motor').attr('disabled', true);
                        // $('#motor').attr('disabled', true);
                        $('#engine_container').hide();
                    }
                }
            });

        }
        //reload date tehnice
        self.model.get('Atribute').reset();
        $.ajax({
            url: app.baseUrl + '/vehicule/getatributevehicul',
            data: params,
            dataType: 'json',
            contentType:'application/json',
            type: 'GET',
            success: function(response) {
                if(response.error !==''){
                    w2alert(response.error);
                }
                self.model.get('Atribute').reset(response.atribute);
                if (self.isNew) {
                    self.renderAtributes();
                }
                self.model.set('nr_registru',response.nr_registru);
                self.model.set('mentiuni', response.mentiuni);
                self.renderMentiuni();
            },
            error: function(response) {
                console.error(response);
            }
        });
        //reload anvelope
        self.model.get('Anvelope').reset();
        $.ajax({
            url: app.baseUrl + '/vehicule/getanvelopevehicul',
            data: params,
            dataType: 'json',
            type: 'GET',
            success: function(response) {
                app.Cereri.controller.loadListeAnvelope(self.model, function() {
                    self.model.get('Anvelope').reset(response);
                    if (self.isNew) {
                        self.renderAnvelope();
                    } else {
                       app.Cereri.trigger('anvelopeView:setSelect');
                    }
                    // self.renderanvelope();
                });
            },
            error: function(response) {
                console.error(response);
            }
        });
    }
  }

  onAttach(){
    var pstyle = 'border: 1px solid #dfdfdf; padding: 10px;';
    //build layout
    if(!w2ui.hasOwnProperty('layoutVehicul')){
        $('#vehiculTemplate').w2layout({
            name: 'layoutVehicul',
            panels: [{
                    type: 'left',
                    size: '50%',
                    style: pstyle,
                    title: 'Date principale',
                    resizable: true,
                    content: $('#date_principale').html()
                }, {
                    type: 'main',
                    size: '50%',
                    title: 'Date tehnice',
                    style: pstyle,
                    content: $('#date_tehnice').html()
                }, {
                    type: 'bottom',
                    size: 60,
                    style: pstyle,
                    content: $('#buttons_container').html()
                }

            ]
        });
    }
    //set dropdowns for controls that suport it
    this.setupView();
    //if record is in update state we enable buttons and render child records and "mentiuni" property
    if (!this.isNew) {
        this.renderAtributes();
        app.Cereri.controller.loadListeAnvelope(this.model, this.renderAnvelope.bind(this));
        this.renderMentiuni();
        // this.enableCopy();
    }

    if(this.model.id){
        console.log(this.options);
        this.relatedVehicles = this.options.relatedVehicles;
        this.prepareFormNavigation();
    }

  }



  renderAtributes(){
    var options = {
        element: '#date_tehnice_container',
        atributes: this.model.get('Atribute')
    };
    app.Cereri.controller.renderAtributes(options);
  }

  renderAnvelope(){
    var self = this;
    var options = {
        element: '#anvelope_container',
        anvelope: self.model.get('Anvelope')
    };
    app.Cereri.controller.renderAnvelope(options);
  }

  renderMentiuni(){
    if(this.model.get('mentiuni')){
        var mentiuni = this.model.get('mentiuni').split('\n');
        $('.mentiuni').find('input').val('');
        for (var i = 0; i < mentiuni.length; i += 1) {
            $('#ment' + (i + 1)).val(mentiuni[i]);
        }
    }
  }

  save() {
      var self = this;
      var options = {
          silent:true,
          success: function(model) {
              var opt = {
                  text: 'Inregistrarea a fost salvata!',
                  title:'Notificare',
                  type: 'success-template'
              };
              Util.showNotification(opt);
              if (self.model.get('isCopy')) {
                  app.router.navigate('appciv/detaliiVehicul/' + model.id);
                  self.model.set('isCopy', false);
              }

              self.enableCopy();
          },
          error: function(model, response) {
              // we get the errors as a string. This was implemented so that we can show
              // both errors comming from server and from client. We modded the validate
              // function of the model so that it returns a JSON string containing an element named errors
              // from server we get the same result
              if (response.status !== 401) {
                  var opt = {
                      text: 'Eroare la salvare!',
                      title:'Notificare',
                      type: 'error-template'
                  };
                Util.showNotification(opt);
                  var data = eval('(' + response.responseText + ')');
                  //console.log(data);
                  w2utils.validateRaw(self.$el, data.data);
              }
          }
      };
      console.log(this.model);
      if (self.validatenewvin() && w2utils.validate(self.model, self.$el)) {
          self.model.save({}, options);
      }
  }

  prepareFormNavigation(){
    this.currentIndex = this.relatedVehicles.indexOf(this.model.id) +1;
    $('#currentIndex').val(this.currentIndex);
  }

  gotofirst(){
      var id = this.relatedVehicles[0];
      app.Cereri.router.navigate('cereri/detaliiVehicul/' + id, true);
  }

  gotolast(){
      var id = this.relatedVehicles[this.relatedVehicles.length-1];
      app.Cereri.router.navigate('cereri/detaliiVehicul/' + id, true);
  }
  gotonext(){
      if(this.currentIndex < this.relatedVehicles.length){
          var id = this.relatedVehicles[this.currentIndex];
          app.Cereri.router.navigate('cereri/detaliiVehicul/' + id, true);
      }
  }
  gotoprev(){
      if(this.currentIndex > 1){
          var id = this.relatedVehicles[this.currentIndex-2];
          app.Cereri.router.navigate('cereri/detaliiVehicul/' + id, true);
      }
  }

  validatenewvin(e) {
      var errors = {};
      var data = [];
      errors.data = data;
      var real_vin = this.model.get('vin');
      if(!real_vin){
           data.push({
                  name: 'vin',
                  message: 'Camp obligatoriu!'
              });
              //app.Util.showError({}, errors);
              w2utils.validateRaw(this.$el, data);
              return false;
      }
      var vin = real_vin.toUpperCase();
      var regex = /^[A-HJ-NP-Z0-9]+$/; ///^\w+$/; ///^[0-9A-Za-z]+$/;
      //var wild = /^$/;

      if (vin !== undefined && vin.length > 0) {
          if (regex.test(vin) && vin.length === 17) {
              //app.Util.removeError($('#vin').parent());
              this.model.set('vin', vin);
              return true;
              //}else if(wild.test(vin)){

          } else {
              data.push({
                  name: 'vin',
                  message: 'Valoare incorecta!'
              });
              //app.Util.showError({}, errors);
              w2utils.validateRaw(this.$el, data);
              return false;
          }
      } else {
          data.push({
              name: 'vin',
              message: 'Camp obligatoriu!'
          });
          //app.Util.showError({}, errors);
          w2utils.validateRaw(this.$el, data);
          return false;
      }
  }

  copy() {
      //this._modelBinder.unbind();

      // var Prototype = app.module('vehicul').VehiculModel;
      // var newmodel = this.model; //new Prototype(this.model.toJSON());
      $('#culoare').w2field().reinit();
      this.model.set('EntityState', 0).set('vin', '')
          .set('isCopy', true)
          .set('serie_motor', '')
          .set('culoare','')
          .unset('id');
      this.model.get('Atribute').each(function(model) {
          model.set('EntityState', 0).unset('id').unset('id_vehicul');
      });
      this.model.get('Anvelope').each(function(model) {
          model.set('EntityState', 0).unset('id').unset('id_vehicul');
      });
      this.isCopy = true;
      this.disableCopy();
      // app.router.navigate('#/appciv/copyVehicul/' + this.model.get('id'), {
      //     trigger: false
      // });

  }
  info() {
      var self = this;
      Util.printPDF(app.baseUrl + '/civfiles/GetVehiculComplet?id=' + self.model.id);
  }
  disableCopy() {
      $('#btnCopyVehicul').attr('disabled', true);
      $('#btnVehiculComplet').attr('disabled', true);
  }
  enableCopy() {
      $('#btnCopyVehicul').attr('disabled', null);
      $('#btnVehiculComplet').attr('disabled', null);
  }
  back() {
      var self = this;
      if (this.isDialog) {
          _.find(w2ui.panels, function(p) {
              return p.name === 'editVeh' + self.cid;
          }).destroy();

      } else {
          app.Cereri.router.navigate('cereri/cereri', {
              trigger: true
          });
      }
  }
  onBeforeDestroy(){
      w2ui.layoutVehicul.destroy();
  }
}
