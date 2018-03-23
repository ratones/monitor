var Router = Marionette.AppRouter.extend({
    appRoutes: {
        'home': 'home',
        'settings':'settings',
        'info': 'info',
        '*action': 'home'
    }
});
export default Router;
