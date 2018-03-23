import Backbone from 'backbone';

export default class User extends Backbone.Model {
    constructor(options) {
        super(options);
        //this.set('auth',false);
        this.set('roles', []);
        //this.listenTo(app,'user:unauthorized:request',this.login);
    }
    urlRoot(){
      return app.Security.baseUrl + 'account/user';
    }

    login() {
        return app.controller.login();
    }

    logoff() {
        var self = this;
        $.ajax({
            url: app.Security.baseUrl + 'account/logoff',
            type: 'POST',
            beforeSend: function (xhr) {
                /* Authorization header */
                xhr.setRequestHeader("Authorization", "Basic logout");
            },
            success: function() {
                //unset application User
                var user = {};
                user.uid = 0;
                user.displayname = 'Anonim';
                user.auth = false;
                user.api = 'unauthorized';
                user.expert = null;
                user.id_beneficiar = null;
                self.set(user);
                self.set('roles', []);
                //remove session cookie from storage
                localStorage.removeItem('session');
                //remove window cookie to prevent reauthorize on reload
                requireNode('nw.gui').Window.get().cookies.remove({ url: 'http://localhost', name: '.authDOT' });
                window.location.hash = '#gohome';
                self.trigger('user:login');
            },
            error: function() {
                w2alert('Eroare la delogare!');
            }
        });
    }

    isInRole(roles) {
        if (_.intersection(roles, this.get('roles')).length > 0) {
           return true;
        }
        return false;
    }

    getRoles() {

    }
}
