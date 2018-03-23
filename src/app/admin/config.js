export default{
  external_server: 'https://prog.rarom.ro:446/dotapi/',
  intranet_server: 'http://10.1.0.32:8083/dotapi/',
  dev_server: 'http://10.2.2.10:8083/dotapi/',
  mainElementID: 'container',

  menu: function(){
    return [{
      visibility:{
        anonim: false,
        authenticated: true,
        roles:[1]
      },
      label: 'Administrare',
      submenu: [{
        label: ' Utilizatori',
        click: function(){
           window.location.hash = '#admin/listaUtilizatori';
        },
        icon:'./assets/menuicons/users.png',
      }]
    }];
  }
}
