import Config from './../config';
import Util from './../../util';
export default class IndexView extends Mn.View {
    constructor(props) {
        let local = $.extend(props, {
            className: 'fullscreen'
        });
        super(local);
        this.template = _.template(`<div style="display:none">
										<input id="fileupload" type="file" class="file" name="files[]" multiple  accept=".xml">
									</div>
									<div id="grid" class="fullscreen"></div>`);
        this.setPermissions();
    }

    onAttach() {
        var self = this;
        this.$el.find('#grid').w2grid(Config.index.apply(self));
        this.disableGridButtons();
        this.buildUpload();
    }

    setPermissions() {
        this.allowDelete = app.User.isInRole([1]);
        this.allowPrint = app.User.isInRole([1, 10]);
    }

    onBeforeDestroy() {
        w2ui['gridCereri'].stateSave();
        for (var i in w2ui['gridCereri'].records) {
            var recid = w2ui['gridCereri'].records[i].recid;
            if (w2ui.hasOwnProperty('gridVehicule_' + recid)) {
                w2ui['gridVehicule_' + recid].destroy();
            }
        }
        w2ui.gridCereri.destroy();
    }

    getJurnal(id) {
        var self = this;
        Util.printPDF(app.baseUrl + '/civfiles/GetJurnalComanda?id=' + id);
    }

    getRaport(id) {
        var self = this;
        Util.printPDF(app.baseUrl + '/civfiles/GetRaportComanda?id=' + id);
    }

    arhivareCIV(id) {
        app.Cereri.controller.arhivareComanda(id);
    }

    anulareComanda(id){
      app.Cereri.controller.anulareComanda(id,this.refreshGrid);
    }

    printRaport(id) {
        //
        var self = this;
        Util.printPDF(app.baseUrl + '/civfiles/GetTiparCIVComanda?id=' + id, {
            onclosed: function(win) {
                w2confirm('Finalizati tiparirea comenzii?').yes(function() {
                    $.post(app.baseUrl + '/vehicule/finalizeComanda/' + id);
                }).no(function() {
                });
            },
						id:'TiparComanda' + id,
						headerTitle:'Tipar Comanda ' + id
        });
    }

    disableGridButtons() {
        w2ui['gridCereri'].toolbar.disable('btnPlata');
        w2ui['gridCereri'].toolbar.disable('btnEdit');
        w2ui['gridCereri'].toolbar.disable('w2ui-delete');
        w2ui['gridCereri'].toolbar.disable('btnUpload');
        w2ui['gridCereri'].toolbar.disable('btnJurnal');
        w2ui['gridCereri'].toolbar.disable('btnRaport');
        w2ui['gridCereri'].toolbar.disable('btnPrintCIV');
        w2ui['gridCereri'].toolbar.disable('btnArhivareCIV');
        w2ui['gridCereri'].toolbar.disable('btnExcel');
        w2ui['gridCereri'].toolbar.disable('btnPostComanda');
        w2ui['gridCereri'].toolbar.disable('btnAnulare');
    }

    buildUpload() {
        var self = this;
        $('#fileupload').fileinput({
            uploadUrl: app.baseUrl + '/CIVFiles/uploadComanda',
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
                var id_comanda = w2ui['gridCereri'].getSelection() || null;
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
                w2ui['gridCereri'].lock();
                $('#fileupload').fileinput('upload');
            })
            .off('filebatchuploadsuccess').on('filebatchuploadsuccess', self.uploadComplete)
            .off('filebatchuploaderror').on('filebatchuploaderror', self.uploadError);
    }
    choosefile() {
        var chooser = this.$el.find('#fileupload');
        chooser.trigger('click');
    }
    uploadComplete(e, data) {
        var response = data.response; //(data.result);
        w2ui['gridCereri'].unlock();
        switch (response.code) {
            case 1: // comanda ok
                Util.showNotification({
                    type: 'success-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 2: //comanda ok, veh in eroare
            case 3:
                Util.showNotification({
                    type: 'warning-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 4: //comanda not ok
                Util.showNotification({
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            case 6: //comanda not ok
                Util.showNotification({
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
            default:
                Util.showNotification({
                    type: 'error-template',
                    text: response.message,
                    title: 'Notificare'
                });
                break;
        }
        if (response.comanda) {
            if (response.isNew) {
                w2ui['gridCereri']('add', response.comanda);
            } else {
                w2ui['gridCereri'].set(response.comanda.id, response.comanda);
                if (w2ui.hasOwnProperty('gridVehicule_' + response.comanda.id)) {
                    w2ui['gridVehicule_' + response.comanda.id].reload();
                }
            }

        }
        //app.module('cerere').trigger('vehicule:load', model.id);
    }
    uploadError(e, data) {
        $('#fileupload').fileinput('reset');
        w2ui['gridCereri'].unlock();
        Util.showNotification({
            type: 'error-template',
            text: 'Eroare la transmitere! Verificati fisierul!',
            title: 'Notificare'
        });
    }
    refreshGrid(error) {
        if (error) {
            w2alert(error);
        } else {
            w2ui['gridCereri'].reload();
        }
    }
}
