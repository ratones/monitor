export default class AdminRouter extends Mn.AppRouter {
    constructor(options) {
    	var local = $.extend(options,{
            appRoutes: {
                'admin/*action': 'request'
            }
        });
        super(local);
    }
}
