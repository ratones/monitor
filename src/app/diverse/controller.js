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

  listaBeneficiari(){
    var View = new app.Diverse.BeneficiariView();
    app.getView().showChildView('container', View);
  }

  listaProducatori(){
    var View = new app.Diverse.ProducatoriView();
    app.getView().showChildView('container', View);
  }

  listaActeNormative(){
    var View = new app.Diverse.ActeNormativeView();
    app.getView().showChildView('container', View);
  }

  listaPrescriptii(){
    var View = new app.Diverse.PrescriptiiView();
    app.getView().showChildView('container', View);
  }

  editBeneficiari(id){
    var Model = app.Diverse.BeneficiariModel;
    var EditorView = app.Diverse.EditBeneficiariView;
    var m = new Model({
      id: id
    });
    var view = new EditorView({model: m});
    app.getView().showChildView('modal', view);
  }
}
