import Controller from './controller';
import Router from './router';
import Util from './util';
import Config from './config';

//create instance of our application
var Application = Marionette.Application.extend({
    region: '#mainLayout'
});

var app = window.app = global.app = new Application();


// var ModalRegion = new Mn.Region({el:'#modal'});
// app.addRegions({
//   ModalRegion: "#modal"
// });

/*==================================================================
=            Initialize global settings for application            =
==================================================================*/

//create main controller - will handle application level commands
var controller = new Controller();
//create main router - will handle app level routes and redirects to ceresponding action in controller
var router = new Router({
    controller: controller
});

// app.User = new User();

// const notificationHandler = new NotificationHandler();

//set app router and controller
app.Controller = controller;
app.Router = router;

//set base url address
app.baseUrl = 'http://www.monitor.tokinomo.com/api/index.php/';
app.domain = Util.getDomainUrl(Config);

//Stickit default for comboboxes in w2ui
// Backbone.Stickit.addHandler({
//     selector: '.w2ui-select',
//     events: ['keyup', 'change', 'paste', 'cut'],
//     update: function($el, val) {
//         console.log(val);
//         $el.w2field().setItemById(val);
//     },
//     getVal: function($el) {
//       var me = this;
//         return $el.data('selected').id;
//     }

// });

/*=====  End of Initialize global settings for application  ======*/

// setting page title based on route

function normalizeTitle(title) {
    return title.replace(/([A-Z])/g, ' $1')
        // uppercase the first character
        .replace(/^./, function(str) {
            return str.toUpperCase();
        });
}

app.listenTo(app, 'app:set:title', function(title) {
    $('#lblPageTitle').html(normalizeTitle(title));
});

app.Config = Config;
app.Util = Util;

/*====================================
=            Load modules            =
====================================*/
// app.Security = require('./security/loader');
import Security from './security/loader';
app.Security = new Security();
import Campaigns from './campaigns/loader';
app.Campaigns = new Campaigns()
import Devices from './devices/loader';
app.Devices = new Devices()
/*=====  End of Load modules  ======*/

/*========================================================
=            Setup application level requests and events         =
========================================================*/

app.listenTo(app,'app:show:notification',(options)=>{
  Util.showNotification(opt);
});
app.listenTo(app,'app:show:error',(options)=>{
  Util.showError(opt);
});
// app.listenTo(app, 'app:grid:edited', function(options) {
//     var opt = {
//         text: 'Inregistrarea a fost salvata!',
//         title: 'Notificare',
//         type: 'success-template'
//     };
//     Util.showNotification(opt);
//     if (w2ui.hasOwnProperty(options.grid))
//         w2ui[options.grid].set(options.model.recid, options.model);
// });
// app.listenTo(app, 'app:grid:added', function(options) {
//     var opt = {
//         text: 'Inregistrarea a fost salvata!',
//         title: 'Notificare',
//         type: 'success-template'
//     };
//     Util.showNotification(opt);
//     if (w2ui.hasOwnProperty(options.grid))
//         w2ui[options.grid].add(options.model,true);
// });

// app.listenTo(app,'app:request:pdf',function(url){
//   Util.printPDF(url);
// });


/*=====  End of Setup application level requests  ======*/

$.ajaxSetup({
    headers: {
        'X-API-KEY':'{0EF476DA-ED14-7516-8024-365F341C9389}',
        'X-API-USER':'ionut'
    }
  });

function bootstrap() {
    app.Security = new Security();
    app.Campaigns = new Campaigns();

    controller.start();
    console.info('Application started!');
    //start routing
    Backbone.history.start({
        pushState: false
    });
}


/**
 *
 * Function to run after the application has started
 *
 */

app.on('start', function(app, options) {
    //check session and reauthorize if found
    bootstrap();
    // options.callback();
});

app.start()
//return application CommonJS
module.exports = app;
