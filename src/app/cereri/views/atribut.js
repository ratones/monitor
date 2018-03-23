export default class AtributView extends Mn.View {
  constructor(props) {
    var options = $.extend(props,{
       className: 'w2ui-field'
    });
    super(options);
    this.bindings = {
        '[name="val"]': 'val',
        '[name="label"]': 'label',
        '[name="min"]': 'min',
        '[name="max"]': 'max'
    };
    this.source = this.model.get('source');
  }
  getTemplate(){
    switch (this.model.get('tip')) {
        case 'interval':
            return require('./../templates/atributItemTemplate.html');
        case 'lista':
            return require('./../templates/atributDropTemplate.html');
        case 'liber':
            return require('./../templates/atributFreeTemplate.html');
        case 'tag':
           return require('./../templates/tag.html');
        default:
            return require('./../templates/atributFreeTemplate.html');
    }
  }
  onRender() {
     if (this.model.get('tip') === 'interval' || parseInt(this.model.get('id_nomenclator')) === 121) {
          this.setNumeric();
      }else if (this.model.get('tip') === 'lista' || this.model.get('source')) {
          this.setSelect();
      }
      this.stickit();
      this.listenTo(this.model, 'change', function() {
          app.Cereri.trigger('attachedProp:changed');
      });

  }
  setSelect() {
      var mdl = this.model;
      if (this.source !== '' && this.source !== undefined && this.source !== null) {
          var data = this.source.split('|'),
              sursa = [],
              ctl = this.$el.find('[name="val"]');
          // daca exista o singura valoare sau suntem in mod editare si valoarea nu este egala cu valoarea unica,
          // afisam atributul pentru a putea fi corectat
          //altfel nu afisam atributul, pentru ca singura valoare posibila este valoarea unica
          //if (data.length > 1 || (this.model.get('EntityState') === 3 && this.model.get('val') !== data[0])) {
          $.each(data, function(index, v) {
              sursa.push({
                  id: v,
                  text: v
              });
          });
          if(mdl.get('tip') === 'tag'){
             var selected = mdl.get('val')?mdl.get('val').split('|'):[]
             ctl.w2field('enum',{
                 items:sursa,
                 openOnFocus:true,
                 selected:selected
             }).on('change', function() {
                 var selected = $(this).data('selected');
                 var val = '';
                 selected.map(function(el){
                     val += '|' + el.text;
                 });
                 mdl.set('val', val.substr(1,val.length));
             });
          }else{
              ctl.w2field('list', {
                  selected: {
                      id: mdl.get('val'),
                      text: mdl.get('val')
                  },
                  items: sursa
              });
          }
          //} else {
          //    this.model.set('val', data[0]);
          //    ctl.parent().remove();
          //}

          //                if (self.model.get('EntityState')===0) {
          //                    self.model.set('val',source.split(',')[0]);
          //                }
      }
  }
  setNumeric() {
    if(parseInt(this.model.get('id_nomenclator')) === 121){
      this.$el.find('[name="val"]').w2field('int');
      return;
    }
     if(Number(this.model.get('min'))<=Number(this.model.get('max')) && Number(this.model.get('min'))!==0){
         var min = 0;
         var max = this.model.get('max');
         switch(this.model.get('id_nomenclator'))
         {
             case 18:
                 min = 0;
                 break;
             default:
                 min = this.model.get('min');
                 break;
         }
          this.$el.find('[name="val"]').w2field('int', {
              min: min,
              max: max
          });
      }

  }
  serializeData() {
      return {
          index: this.options.index
      };
  }
}
