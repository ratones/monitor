import Backbone from 'backbone';

var Profile = Backbone.Model.extend({
    idAttribute: 'id_user',
    urlRoot: function() {
        return app.Security.baseUrl + 'users/profile';
    }
});
module.exports = Profile;
