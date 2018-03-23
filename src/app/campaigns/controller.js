export default class Controller extends Mn.Object {
    constructor() {
      super();
    }
  
    request(route){
      var segments = route.split('/');
      var method = segments[0];
      var args = segments.lenght > 1 ? segments.splice(1, 1) : null;
      this[method].apply(this, args);
      app.trigger('app:set:title', method);
    }

    active(){
        var View = new app.Campaigns.CampaignsView({type:'active'});
        app.getView().showChildView('container', View);
    }
    pending(){
        var View = new app.Campaigns.CampaignsView({type:'pending'});
        app.getView().showChildView('container', View);
    }
    completed(){
        var View = new app.Campaigns.CampaignsView({type:'completed'});
        app.getView().showChildView('container', View);
    }
}