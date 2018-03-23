import Mn from 'backbone.marionette';
import $ from 'jquery'

export default class SecurityRouter extends Mn.AppRouter {
    constructor(options) {
    	var local = $.extend(options,{
            appRoutes: {
              'profile': 'profile',
                'security/*action': 'request'
            }
        });
        super(local);
    }
}
