export default class Controller extends Mn.Object {
  constructor() {
    super();
  }

  request(route) {
      var segments = route.split('/');
      var method = segments[0];
      var args = segments.length > 1 ? segments.splice(1, 1) : null;
      this[method].apply(this, args);
      app.trigger('app:set:title',method);
      console.info('Route requested on Secretariat controller');
  }

  listaIntrari(){
    console.log("am ajuns aici");
    var View = new app.Secretariat.ListaIntrariView();
    app.getView().showChildView('container', View);
  }

  listaIesiri(){
    var ViewIesiri = new app.Secretariat.ListaIesiriView();
    app.getView().showChildView('container', ViewIesiri);
  }

  editIntrare(id){
    var Model = app.Secretariat.IntrareModel;
    var EditorView = app.Secretariat.IntrareView;
    var m = new Model({
        id: id
    });
    var view = new EditorView({model:m});
    app.getView().showChildView('modal',view);
  }

  editIesire(id){
    var Model = app.Secretariat.IesireModel;
    var EditorView = app.Secretariat.IesireView;
    var m = new Model({
        id: id
    });
    var view = new EditorView({model:m});
    app.getView().showChildView('modal',view);
  }

  registruPrint() {

      w2prompt({
        label       : 'Introduceti numarul de inceput:',
        attrs       : 'style="width: 200px"',
        title       : 'Info',
        ok_text     : 'Ok',
        cancel_text : 'Cancel',
        width       : 400,
        height      : 200
    })
    .ok(function (event) {
          app.trigger('app:request:pdf', app.Secretariat.baseUrl + 'files/PrintRegistru?s=' + event);
    });
  }
}
