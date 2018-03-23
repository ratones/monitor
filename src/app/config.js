module.exports = {
	active: true,
	title: 'Aplicatie DOT',
	name: 'appdot',
	external_server: 'https://prog.rarom.ro:446/dotapi/',
	intranet_server: 'http://10.1.0.32:8083/dotapi/',
	dev_server: 'http://10.2.2.10:8083/dotapi/',
	menu:function(){
			return [
			{label:'Program',submenu:[
				{label:' Settings', click:app.Controller.settings,icon:'./assets/menuicons/cogs.png' },
				{label:' Exit', click:app.Controller.quit,icon:'./assets/menuicons/power-off.png' }
			]}
		];
	},
	modules:[
		{id:'Cereri'},
		{id:'Secretariat'},
		{id:'Diverse'},
		{id:'Security'},
		{id:'Admin'}
	]
}
