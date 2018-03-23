export default class IesireModel extends Backbone.SModel {
  constructor(props) {
    super(props);
    this.defaults = {
        intrare: 0
    };
  }
  urlRoot() {
      return app.Secretariat.baseUrl + 'registru/iesire';
  }
  fields() {
      var self = this;
      return [{
              name: 'nr_inregistrare',
              el: '#nr_inregistrare',
              type: 'text'
          }, {
              name: 'data_expediere',
              el: '#data_expediere',
              type: 'date'
          }, {
              name: 'mod_rezolvare',
              el: '#mod_rezolvare',
              type: 'text'
          },
          //                    {field: 'destinatar', type: 'text'},
          {
              name: 'destinatar',
              el: '#destinatar',
              type: 'combo',
              options: {
                  minLength: 0,
                  url:  app.Secretariat.baseUrl + 'utils/GetDestinatari',
                  selected: self.get('destinatar')
              },

          }, {
              name: 'indicativ',
              el: '#indicativ',
              type: 'text'
          }, {
              name: 'observatii',
              el: '#observatii',
              type: 'text'
          }, {
              name: 'legatura_intrare',
              el: '#legatura_intrare',
              type: 'combo',
              options: {
                  minLength: 0,
                  url:   app.Secretariat.baseUrl + 'utils/GetListaIntrari',
                  selected: self.get('legatura_intrare')
              }
          }
      ];
  }
}
