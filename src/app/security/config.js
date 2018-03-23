export default {
  external_server: 'https://prog.rarom.ro:446/dotapi/',
	intranet_server: 'http://10.1.0.32:8083/dotapi/',
	dev_server: 'http://10.2.2.10:8083/dotapi/',
  mainElementID:'container',
  menu:function(){
    return [
      {
        label:'Utilizator',
        visibility:{
          anonim:true,
          authenticated:true,
          roles:[]
        },
        submenu:[
          {
            label:' Login',
            click:app.Security.Controller.login,
            icon:'./assets/menuicons/unlock.png',
            visibility:{
              anonim:true,
              authenticated:false,
              roles:[]
            }
          },
          {
            type:'separator',
            visibility:{
              anonim:false,
              authenticated:false,
              roles:[]
            }
          },
          {
            label:' Profile',
            click:function(){window.location.hash = '#security/profile'},
            icon:'./assets/menuicons/dashboard.png',
            visibility:{
              anonim:false,
              authenticated:true,
              roles:[]
            }
          },
          {
            label:' Logoff',
            click:app.Security.Controller.logoff,
            icon:'./assets/menuicons/lock.png',
            visibility:{
              anonim:false,
              authenticated:true,
              roles:[]
            }
          }
        ]
      }
    ];
  }
};
