export default {
    external_server: 'https://prog.rarom.ro:446/dotapi/',
    intranet_server: 'http://10.1.0.32:8083/dotapi/',
    dev_server: 'http://10.2.2.10:8083/dotapi/',
    mainElementID:'container',
    menu: function() {
        return [{
            visibility: {
                anonim: false,
                authenticated: true,
                roles: []
            },
            label: 'Registru',
            submenu: [{
                    label: ' Intrari',
                    icon:'./assets/menuicons/list.png',
                    click: function() {
                        window.location.hash = '#secretariat/listaIntrari';
                        // app.Router.navigate('secretariat/listaIntrari');
                    }
                },
                {
                    label: ' Iesiri',
                    icon:'./assets/menuicons/list-alt.png',
                    click: function(){
                      window.location.hash = '#secretariat/listaIesiri';
                    }
                },
                {
                    label: ' Print registru',
                    icon:'./assets/menuicons/print.png',
                    click:app.Secretariat.Controller.registruPrint
                }
            ]
        }];
    }
}
