import Util from './../../util';
import Mn from 'backbone.marionette';
export default class SettingsView extends Mn.View {
    constructor(props) {
        const options = $.extend(props, {
            className: 'fullscreen',
            events: {
                'change #enabled': 'enableproxysetup'
            }
        });
        super(options);
        this.template = require('./../templates/settings.html');
        this.model = new Backbone.Model();
    }

    resetapp() {
        localStorage.clear();
    }

    enableproxysetup(e) {
    }


    onAttach() {
         this.initHandler();
    }
    onBeforeDestroy() {
    }

    /* handles the view creation - here we setup our elements, model bindings, etc */
    initHandler() {
        var self = this;
    }

    checkConnection(callback) {
        $.ajax({
            url: app.baseUrl + '/civutils/getmanifest',
            success: function() {
                callback(true);
            },
            error: function() {
                callback(false);
            }
        })
    }

    setinitialproxy() {
    }

    saveHandler() {
    }

}
