class Util extends Mn.Object {
    constructor() {
        super();
    }
    getBaseUrl(config){
    }
    getDomainUrl(config){
      
    }
    getAppPath() {
        // Get path to node_modules
        var a = window.document.createElement('a');
        a.href = window.location.href;
        var pathToAppIndex = a.pathname;

        var pathSegemnts = pathToAppIndex.split('/');
        // Remove last part (index.html of app)
        pathSegemnts.pop();
        var appPath = a.origin + pathSegemnts.join('/') + '/';
        a = null;
        return appPath;
    }

    set enviroment(value) {
        this.env = value
    }

    get enviroment() {
        return this.env;
    }

    showNotification(data) {
        var options = {};
        switch (data.type) {
            case 'error-template':
                options.icon = this.getAppPath() + 'assets/alert-error.png';
                break;
            case 'info-template':
                options.icon = this.getAppPath() + 'assets/alert-info.png';
                break;
            case 'success-template':
                options.icon = this.getAppPath() + 'assets/alert-success.png';
                break;
            case 'warning-template':
                options.icon = this.getAppPath() + 'assets/alert-warning.png';
                break;
            default:
                options.icon = this.getAppPath() + 'assets/alert-info.png';
                break;
        }
        options.body = data.text;
        var notification = new Notification(data.title, options);
        notification.onclick = function() {
            // document.getElementById("output").innerHTML += "Notification clicked";
        }

        notification.onshow = function() {
            // play sound on show
            // myAud = document.getElementById("audio1");
            // myAud.play();

            // auto close after 1 second
            setTimeout(function() {
                notification.close();
            }, 5000);
        };
    }

    get maxExpiredAuthorizationRetries() {
        return 3;
    }


    base64Encode(str) {
        return btoa(str);
    }
    base64Decode(str) {
        return atob(str);
    }

    
    getAppPath() {
        // Get path to node_modules
        var a = window.document.createElement('a');
        a.href = window.location.href;
        var pathToAppIndex = a.pathname;

        var pathSegemnts = pathToAppIndex.split('/');
        // Remove last part (index.html of app)
        pathSegemnts.pop();
        var appPath = a.origin + pathSegemnts.join('/') + '/';
        a = null;
        return appPath;
    }

    downloadFile(url, method, data, filename) {
        // this.getRequestCookie().then((cookie) => {
        //     var request = requireNode('request');
        //     w2utils.lock('#mainLayout', 'Se exporta datele....');
        //     var req = request({
        //             url: url,
        //             method: method,
        //             headers: {
        //                 'Cookie': cookie.name + '=' + cookie.value
        //             },
        //             json: data
        //         })
        //         .on('response', function(res) {
        //             var fws = fs.createWriteStream(filename);
        //             // setup piping
        //             res.pipe(fws);;
        //             // create file write stream
        //             res.on('end', function() {
        //                 w2utils.unlock('#mainLayout');
        //                 w2alert('Fiserul a fost descarcat!');
        //             });
        //         });
        // });
    }

    downloadPDF(url) {
        // var iframe = document.getElementById('download_iframe');
        // if (!iframe) {
        //     iframe = document.createElement('iframe');
        //     iframe.id = "download_iframe";
        //     iframe.style.display = 'none';
        //     document.body.appendChild(iframe);
        // }
        // iframe.src = url;
        // iframe.addEventListener("load", function() {
        //     console.log("FILE LOAD DONE.. Download should start now");
        // });
    }

    // getRequestCookie() {
    //     var deferred = $.Deferred();
    //     var cookie = localStorage.getItem('session');
    //     if (cookie) {
    //         var cookienew = JSON.parse(cookie);
    //         cookienew.url = app.domain;
    //         delete cookienew.hostOnly;
    //         delete cookienew.session;
    //         deferred.resolve(cookienew);
    //     } else {
    //         nw.Window.get().cookies.get({
    //             url: app.domain,
    //             name: '.authDOT'
    //         }, function(c) {
    //             c.url = app.domain;
    //             delete c.hostOnly;
    //             delete c.session;
    //             deferred.resolve(c);
    //         });
    //     }
    //     return deferred.promise();
    // }

    printPDF(url, options) {
        // var self = this;
        // this.getRequestCookie().then((cookienew)=>{
        //   var strURL = escape(url);
        //   var pdfWindow = nw.Window.open(self.getAppPath() + '/pdfviewer/index.html', {
        //       width: 800,
        //       height: 600
        //   }, function(win) {
        //       if (options && options.callback) {
        //          options.callback(win);
        //       }
        //       win.data = { file: strURL,cookie:cookienew };

        //   });
        // });
        // var props = $.extend({
        //     contentSize: {
        //         width: $(window).width() * .8,
        //         height: $(window).height() * .85
        //     },
        //     theme: 'grey',
        //     headerTitle: 'PDF Viewer',
        //     contentIframe: {
        //         src: url
        //     }
        // },options);
        // $.jsPanel(props);

    }

    showError(data) {
        // $.each(data, function(i, err) {
        //     $('#' + err.name).w2tag(err.message, {
        //         'class': 'w2ui-error'
        //     });
        // });
    }
};
export default new Util();
