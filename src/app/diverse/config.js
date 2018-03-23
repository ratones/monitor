export default {
    external_server: 'https://prog.rarom.ro:446/dotapi/',
    intranet_server: 'http://10.1.0.32:8083/dotapi/',
    dev_server: 'http://10.2.2.10:8083/dotapi/',
    mainElementID: 'container',

    menu: function() {
        return [{
            visibility: {
                anonim: false,
                authenticated: true
            },
            label: 'Diverse',
            submenu: [{
                label: ' Beneficiari',
                click: function() {
                    window.location.hash = '#diverse/listaBeneficiari';
                },
                icon:'./assets/menuicons/users.png'
            }, {
                label: ' Producatori',
                click: function() {
                    window.location.hash = '#diverse/listaProducatori';
                },
                icon:'./assets/menuicons/users.png',
            }, {
                label: ' Acte Normative',
                click: function() {
                    window.location.hash = '#diverse/listaActeNormative';
                },
                icon:'./assets/menuicons/list.png',
            }, {
                label: ' Prescriptii Obligatorii',
                click: function() {
                    window.location.hash = '#diverse/listaPrescriptii';
                },
                icon:'./assets/menuicons/list-alt.png',
            }]
        }];
    }
}
