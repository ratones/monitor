export  default class Controller extends Mn.Object{
  constructor(){
    super();
  }

  request(route){
    var segments = route.split('/');
    var method = segments[0];
    var args = segments.lenght > 1 ? segments.splice(1, 1) : null;
    this[method].apply(this, args);
    app.trigger('app:set:title', method);

  }

  listaUtilizatori(){
    var View = new app.Admin.UsersView();
    app.getView().showChildView('container', View);
  }

  loadRoluri(el,parentID){
    var elem = '#' + el;
        var RoluriView = app.Admin.RolesView;
        var roluriView = new RoluriView({
            element: elem,
            parentID: parentID
        });
        roluriView.render();
  }
}
