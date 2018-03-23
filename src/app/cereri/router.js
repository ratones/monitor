export default class CereriRouter extends Mn.AppRouter {
    constructor(options) {
    	var local = $.extend(options,{
            appRoutes: {
                'cereri/*action': 'request'
            }
        });
        super(local);
    }
}
