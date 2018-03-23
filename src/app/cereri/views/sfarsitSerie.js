 var postData = {};
import Util from './../../util'
 export default class SfarsitSerie extends Mn.View{
   constructor(props){
     var options = $.extend(props,{
       className: 'fullscreen',
     });
     super(options);
     this.template = require('./../templates//vins.html');
   }

     onAttach() {
         var self = this;
         this.buildUpload();
         this.renderGrid();
     }
     renderGrid() {
         var self = this;
         this.$el.find('#grid').w2grid({
             name: 'gridVINS',
             url: app.baseUrl + '/vins/getVINS',
             method: 'POST', // need this to avoid 412 error on Safari
             recid: 'id',
             fixedBody: true,
             show: {
                 toolbar: true,
                 footer: true,
                 toolbarAdd: true,
                 toolbarSave: true,
                 toolbarDelete: true
             },
             onAdd: function() {
                 w2ui['gridVINS'].add({
                     recid: 0
                 });
             },
             toolbar: {
                 items: [{
                     type: 'button',
                     id: 'btnchooseFile',
                     caption: 'Alege fisier',
                     icon: 'w2ui-icon-upload',
                     onClick: function(event) {
                         self.choosefile();
                     }
                 }]
             },
             multiSearch: false,
             searches: [{
                 field: 'vin',
                 caption: 'Cod VIN ',
                 type: 'text'
             }, {
                 field: 'tip',
                 caption: 'Tip',
                 type: 'text'
             }, {
                 field: 'varianta',
                 caption: 'Varianta',
                 type: 'text'
             }, {
                 field: 'Versiune',
                 caption: 'Versiune',
                 type: 'text'
             }, {
                 field: 'wvta',
                 caption: 'WVTA',
                 type: 'text'
             }, {
                 field: 'act_normativ',
                 caption: 'Act normativ',
                 type: 'text'
             }],
             columns: [{
                     field: 'vin',
                     caption: 'VIN',
                     size: '30%',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'tip',
                     caption: 'Tip',
                     size: '120px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'varianta',
                     caption: 'Varianta',
                     size: '100px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'versiune',
                     caption: 'Versiune',
                     size: '120px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'wvta',
                     caption: 'WVTA',
                     size: '150px',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'extensie',
                     caption: 'Extensie',
                     size: '30%',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
                 }, {
                     field: 'act_normativ',
                     caption: 'Act normativ',
                     size: '30%',
                     sortable: true,
                     editable: {
                         type: 'text',
                         required: true
                     }
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
             }
         });
         w2ui['gridVINS'].stateRestore();

         //this.buildUpload();

     }
     onBeforeDestroy() {
         w2ui['gridVINS'].stateSave();
         w2ui.gridVINS.destroy();
     }

     choosefile() {
         var chooser = this.$el.find('#fileupload');
         // chooser.off('change').on('change', function(evt) {
         //     console.log($(this).val());
         // });

         chooser.trigger('click');
     }

     setUploadEvent() {
         var chooser = this.$el.find('#fileupload');
     }

     buildUpload() {
         var self = this;
         $('#fileupload').fileinput({
             uploadUrl: app.baseUrl + '/files/uploadxls',
             uploadClass: 'btn btn-toolbar',
             uploadTitle: 'Trimite fisier',
             uploadLabel: ' Trimite',
             uploadIcon: '<i class="w2ui-icon-upload"></i>',
             showPreview: false,
             showRemove: false,
             showUpload: false,
             showCaption: false,
             progressClass: 'hide',
             uploadExtraData: function() {
                 var id_comanda = w2ui['gridVINS'].getSelection() || null;
                 if (id_comanda) {
                     return {
                         id_comanda: id_comanda
                     };
                 }
             },
             browseClass: 'btn disabled btn-toolbar',
             browseTitle: 'Alege fisiere',
             browseLabel: ' Incarca vehicule',
             browseIcon: '<i class="w2ui-icon-folder"></i>',
             removeClass: 'btn btn-toolbar',
             removeTitle: 'Reset',
             removeLabel: ' Reset',
             removeIcon: '<i class="w2ui-icon-cross"></i>'
         });

         $('#fileupload')
             .off('fileloaded').on('fileloaded', function() {
                 w2ui['gridVINS'].lock();
                 $('#fileupload').fileinput('upload');
             })
             .off('filebatchuploadsuccess').on('filebatchuploadsuccess', self.uploadComplete)
             .off('filebatchuploaderror').on('filebatchuploaderror', self.uploadError);
     }

     uploadComplete(e, data) {
         var response = data.response.response; //(data.result);
         w2ui['gridVINS'].unlock();
         switch (response.code) {
             case 1: // comanda ok
                 Util.showNotification({
                     type: 'success-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 2: //comanda ok, veh in eroare
             case 3:
                 Util.showNotification({
                     type: 'warning-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 4: //comanda not ok
                 Util.showNotification({
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             case 6: //comanda not ok
             case 0:
             case 9:
             case 8:
                 Util.showNotification({
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
             default:
                 Util.showNotification({
                     type: 'error-template',
                     text: response.message,
                     title:'Notificare'
                 });
                 break;
         }
         w2ui['gridVINS'].reload();
     }

     uploadError(e, data) {
         $('#fileupload').fileinput('reset');
         w2ui['gridVINS'].unlock();
         ipc.send('app:notification:show', {
             type: 'error-template',
             text: 'Eroare la transmitere! Verificati fisierul!',
             title:'Notificare'
         });
     }
 }
