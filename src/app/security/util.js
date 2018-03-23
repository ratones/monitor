import Mn from 'backbone.marionette';
class Util extends Mn.Object {
    constructor() {
        super();
        this.env = 'dev';
        this.usersDataList = this.getUserListFromStore();
    }

    getUserListFromStore() {
        let ulist = localStorage.getItem('ulist');
        if (ulist) {
            return JSON.parse(this.base64Decode(ulist));
        } else {
            return [];
        }
    }

    set enviroment(value) {
        this.env = value
    }

    get enviroment() {
        return this.env;
    }

    updateUserInDataList(user) {
        let existingUser = _.findWhere(this.usersDataList, {
            u: user.username
        });
        if (existingUser) {
            existingUser.p = user.password;
        } else {
            this.usersDataList.push(user);
        }
        localStorage.setItem('ulist', this.base64Encode(JSON.stringify(this.usersDataList)));
    }

    get rememberedUsers() {
        return this.usersDataList;
    }

    get maxExpiredAuthorizationRetries() {
        return 3;
    }

    handleUnauthorized() {
        return app.User.login();
    }

    base64Encode(str) {
        return btoa(str);
    }
    base64Decode(str) {
        return atob(str);
    }


};
export default new Util();
