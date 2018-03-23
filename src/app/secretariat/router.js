export default class SecretariatRouter extends Mn.AppRouter {
    constructor(options) {
    	var local = $.extend(options,{
            appRoutes: {
                'secretariat/*action': 'request'
            }
        });
        super(local);
    }
}
