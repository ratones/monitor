import Util from './../util';
import Mn from 'backbone.marionette';
class LoginView extends Mn.View {
    constructor(options) {
        super({
            events: {
                'input #username': 'trysetpass',
                'keyup #loginForm': 'submitForm',
                'click #btnLogin':'loginHandler',
                'click #btnCancel':'close'
            },
            // className: 'windowContent w2ui-reset w2ui-form'
        });
        this.template = require('./../templates/login.html');
        // this.rememberedUsers = Util.rememberedUsers;
        // this.winOptions={
        //   width : '420px',
        //   height : '220px',
        //   isModal : true,
        //   modal:true,
        //   name:'loginWindow',
        //   title : 'Autentificare',
        //   buttons:`  <button class="w2ui-btn w2ui-btn-blue" id="btnLogin" name="save">Login</button>
        //             <button class="w2ui-btn" id="btnCancel" name="reset">Cancel</button>`
        // }

        this.deferred = $.Deferred();
        // this.events= {
        //     'input #username': 'trysetpass',
        //     'keyup #loginForm': 'submitForm'
        // };
    }

    promise(){
      return this.deferred.promise();
    }

    onAttach(){
    //   this.initHandler();
    }
    onBeforeDestroy(){
      var self = this;
      app.Security.User.trigger('user:login');
    //   if(w2ui.hasOwnProperty('loginform')){
    //     w2ui.loginform.destroy();
    //   }
      self.deferred.resolve();

    }
    /* handles the close event of the panel. we destroy the view here */

    /* handles the view creation - here we setup our elements, model bindings, etc */
    initHandler() {
        var self = this;
        this.model = app.Security.User;
        // $('#loginForm').w2form({
        //     name: 'loginform',
        //     url: 'server/post',
        //     fields: [
        //         { field: 'username', type: 'text', required: true },
        //         { field: 'password', type: 'text', required: true },
        //         { field: 'remember', type: 'checkbox' }
        //     ],
        //     record: self.model.toJSON()
        // });
        this.rememberedUsers.map((user)=>{
            $('#usrlist').append(`<option value="${user.u}"></option>`);
        });

    }

    /* handles server login and triggers global user event - used to reload sidebar and others based on user roles and status */

    loginHandler() {
            var self = this;
            console.log(w2ui['loginform'].validate());
            if (w2ui['loginform'].validate().length === 0) {
                //this.model.set(w2ui['loginform'].record);
                $.ajax({
                    url: app.Security.baseUrl + 'account/login',
                    type: 'POST',
                    data: w2ui['loginform'].record,
                    dataType: 'json',
                    success: function(body) {
                        self.model.set(body).set('auth', true);
                        nw.Window.get().cookies.get({
                            url: app.domain,
                            name: '.authDOT'
                        }, function(cookie) {
                            if (cookie) {
                                localStorage.setItem('session', JSON.stringify(cookie));
                            }
                        });
                        if(w2ui['loginform'].record.remember)
                            Util.updateUserInDataList({u:w2ui['loginform'].record.username,p:w2ui['loginform'].record.password});
                        self.win.close();
                        self.deferred.resolve();
                    },
                    error: function(body) {
                        w2alert('Invalid!');
                    }
                });
            }
        }
        /* handles for submit on enter - is triggered at view level, on keyup(see view events) */

    submitForm(e) {
        console.log('here');
        var self = this;
        if (e.which === 13) {
            self.$el.find('[name="save"]').click();
        }
    }

    close(){
      this.win.close();
    }

    /* handles autocomplete user password based on stored users in local storage */

    trysetpass(e) {
        var self = this;
        var selectedUser = _.findWhere(this.rememberedUsers,{u:$(e.currentTarget).val()});
        if(selectedUser){
            $('#password').val(selectedUser.p);
            w2ui['loginform'].record.password = selectedUser.p;
        }else{
            $('#password').val('');
            w2ui['loginform'].record.password = '';
        }
    }
}



export default LoginView;
