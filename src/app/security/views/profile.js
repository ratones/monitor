import Util from './../util';
import Mn from 'backbone.marionette';
export default class Profile extends Mn.View{
	constructor(props){
		var options = $.extend(props,{
			className: 'fullscreen',
			events: {
					'click #btnSaveProfile': 'save',
					'click #btnChangePass': 'showpasschange',
					'change #setupproxy': 'enableproxysetup',
					'click #btnReset': 'resetapp'
			}
		});
		super(options);
		this.template = require('./../templates/profile.html');
		this.bindings =
		{
			'[name="username"]': 'username',
			'#user_displayname': 'user_displayname',
			'#address': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').adresa2;
					},
					onSet: function(value) {
							this.model.get('beneficiar').adresa2 = value;
							return this.model.get('beneficiar');
					}
			},
			'#company': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').denumire_beneficiar;
					},
					onSet: function(value) {
							this.model.get('beneficiar').denumire_beneficiar = value;
							return this.model.get('beneficiar');
					}
			},
			'#telefon': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').telefon;
					},
					onSet: function(value) {
							this.model.get('beneficiar').telefon = value;
							return this.model.get('beneficiar');
					}
			},
			'#fax': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').fax;
					},
					onSet: function(value) {
							this.model.get('beneficiar').fax = value;
							return this.model.get('beneficiar');
					}
			},
			'#cont': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').cont;
					},
					onSet: function(value) {
							this.model.get('beneficiar').cont = value;
							return this.model.get('beneficiar');
					}
			},
			'#banca': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').banca;
					},
					onSet: function(value) {
							this.model.get('beneficiar').banca = value;
							return this.model.get('beneficiar');
					}
			},
			'#nr_reg_com': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').atribut_fiscal;
					},
					onSet: function(value) {
							this.model.get('beneficiar').atribut_fiscal = value;
							return this.model.get('beneficiar');
					}
			},
			'#calitate': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').calitate;
					},
					onSet: function(value) {
							this.model.get('beneficiar').calitate = value;
							return this.model.get('beneficiar');
					}
			},
			'#cui': {
					observe: 'beneficiar',
					onGet: function(value) {
							return this.model.get('beneficiar').cod_fiscal;
					},
					onSet: function(value) {
							this.model.get('beneficiar').cod_fiscal = value;
							return this.model.get('beneficiar');
					}
			},
			'#email': 'email',
			'#password': 'password',
			'#newpass': 'newpass',
			'#confirmedpass': 'confirmedpass',
			'#setupproxy': 'setupproxy',
			'#proxy_protocol': 'proxy_protocol',
			'#proxy_user': 'proxy_user',
			'#proxy_pass': 'proxy_pass',
			'#proxy_address': 'proxy_address',
			'#proxy_port': 'proxy_port'
		};
		this.hasproxy = false;
	}

	onAttach(){
		var self = this;
		//_.bindAll(this, 'showpasschange', 'save', 'modelchanged', 'enableproxysetup', 'resetapp');
		var Proto = require('./../models/profile');
		//app.User = ipc.sendSync('user:request:fromcache', 'appciv');
		//app.trigger('user:updated');
		this.model = new Proto({
				id: app.Security.User.id
		});
		this.model.fetch().then(function() {
				self.buildView();
				self.stickit();
		});
		this.model.on('change', this.modelchanged);
	}

	resetapp() {
			localStorage.clear();
	}

	buildView() {
			var self = this;
			console.log(this.model);
			this.setinitialproxy();
			var tabs = [{
					id: 'tab1',
					caption: 'General'
			}, {
					id: 'tab2',
					caption: 'Proxy'
			}, {
					id: 'tab3',
					caption: 'Schimbare parola'
			}]
			// if (this.model.get('id_beneficiar') !== 0) {
			// 		tabs.push({
			// 				id: 'tab4',
			// 				caption: 'Date Beneficiar'
			// 		});
			// }
			$('#userContainer').w2form({
					name: 'userContainer',
					tabs: tabs,
					actions: {
							reset: function() {
									self.resetapp();
							},
							save: function() {
									if (this.validate().length === 0) {
											self.save();
									}
							}
					}
			});
			w2ui.userContainer_tabs.on('click', function(tab) {
					if (tab.target === 'tab4')
							w2ui.gridReprezentanti.refresh();
			});
			// $('#grid_rep').w2grid({
			// 		name: 'gridReprezentanti',
			// 		url: app.baseUrl + 'appciv/beneficiari/getreprezentanti/' + self.model.get('beneficiar').id_benef,
			// 		recid: 'id_reprezentant',
			// 		columns: [{
			// 				field: 'id_reprezentant',
			// 				caption: 'ID',
			// 				size: '0px',
			// 				hidden: true
			// 		}, {
			// 				field: 'id_beneficiar',
			// 				caption: 'ID_B',
			// 				size: '0px',
			// 				hidden: true
			// 		}, {
			// 				field: 'nume_reprezentant',
			// 				caption: 'Nume reprezentant',
			// 				size: '25%',
			// 				editable: {
			// 						type: 'text'
			// 				}
			// 		}, {
			// 				field: 'functie',
			// 				caption: 'Functie',
			// 				size: '25%',
			// 				editable: {
			// 						type: 'text'
			// 				}
			// 		}, {
			// 				field: 'telefon',
			// 				caption: 'Telefon',
			// 				size: '25%',
			// 				editable: {
			// 						type: 'text'
			// 				}
			// 		}, {
			// 				field: 'email',
			// 				caption: 'Email',
			// 				size: '25%',
			// 				editable: {
			// 						type: 'email'
			// 				}
			// 		}],
			// 		show: {
			// 				toolbar: true,
			// 				footer: true,
			// 				toolbarAdd: true,
			// 				toolbarSave: true,
			// 				toolbarDelete: true
			// 		},
			// 		toolbar: {},
			// 		parser: function(response) {
			// 				var data = $.parseJSON(response);
			// 				return {
			// 						status: 'success',
			// 						records: data.rows,
			// 						total: data.records
			// 				};
			// 		},
			// 		onAdd: function() {
			// 				w2ui['gridReprezentanti'].add({
			// 						recid: 0,
			// 						id_beneficiar: self.model.get('beneficiar').id_benef
			// 				});
			// 		},
			// 		onSave: function(event) {
			// 				w2ui['gridReprezentanti'].reload();
			// 		},
					// fixedBody: false
			// });
			//self.stickit();
	}

	showpasschange(e) {
			e.preventDefault();
			var self = this;
			self.canceled = false;
			$('#changepassContainer').show('blind');
			$(e.currentTarget).replaceWith('<button id="btnCancelPass" class="btn btn-danger">Renunta la schimbarea parolei</button>');
			$('#btnCancelPass').on('click', function(ev) {
					self.canceled = true;
					self.model.set('newpass', '').set('confirmedpass', '');
					$('#changepassContainer').hide('blind');
					$(ev.currentTarget).replaceWith('<button id="btnChangePass" class="btn btn-primary">Schimba parola</button>');
			});
	}

	enableproxysetup(e) {
			var self = this;
			if ($(e.currentTarget).prop('checked')) {
					self.hasproxy = true;
					$('.proxydata').prop('disabled', null);
			} else {
					self.hasproxy = false;
					$('.proxydata').prop('disabled', 'disabled');
			}
	}

	setinitialproxy() {
		  var px = localStorage.getItem('proxy');
			var setupproxy;
			if(px){
				try{
					setupproxy = JSON.parse(px);
				}catch(e){
					setupproxy = JSON.parse(Util.base64Decode(px));
				}
			}
			if (setupproxy && setupproxy.enabled) {
					// if (setupproxy.enabled && !$('#setupproxy').prop('checked')) {
					//     $('#setupproxy').prop('checked', true);
					// }
					// console.log(setupproxy);
					this.model.set('setupproxy', setupproxy.enabled);
					this.model.set(setupproxy);
					$('.proxydata').prop('disabled', null);
					// $('#proxy_protocol').val(setupproxy.protocol);
					// $('#proxy_user').val(setupproxy.user);
					// $('#proxy_pass').val(setupproxy.pass);
					// $('#proxy_address').val(setupproxy.address);
					// $('#proxy_port').val(setupproxy.port);
			}
	}

	setproxy() {
			var proxy = {
					enabled: $('#setupproxy').prop('checked'),
					proxy_protocol: $('#proxy_protocol').val(),
					proxy_user: $('#proxy_user').val(),
					proxy_pass: $('#proxy_pass').val(),
					proxy_address: $('#proxy_address').val(),
					proxy_port: $('#proxy_port').val()
			};
			localStorage.setItem('proxy', Util.base64Encode(JSON.stringify(proxy)));
			//Util.resetProxy();
	}
	modelchanged(model) {
			var self = this;
			var field = _.keys(model.changed)[0];
			var newVal = _.values(model.changed)[0];
			// app.Util.removeError($('#' + field));
			self.inerror = false;
			if (field === 'newpass') {
					var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
					if (!re.test(newVal)) {
							self.inerror = !self.canceled;
							var data = [{
									name: 'newpass',
									message: 'Minim 6 caractere, o cifra si un caracter majuscul'
							}];
							app.trigger('app:show:error',data);
					}
			}

			if (field === 'confirmedpass') {
					if (newVal !== model.get('newpass')) {
							self.inerror = !self.canceled;
							var data = [{
									name: 'confirmedpass',
									message: 'Valoarea introdusa nu este identica cu parola de mai sus'
							}];
							app.trigger('app:show:error',data);
					}
			}
			if (!self.inerror) {
					$('#btnSaveProfile').attr('disabled', null);
			}
	}

	save(e) {
			// e.preventDefault();

			var self = this;
			//if(self.hasproxy)
			self.setproxy();
			var options = {
					success: function(model) {
						app.User.set('displayname',model.get('user_displayname'));
							var opt = {
									title: 'Notificare',
									text: 'Inregistrarea a fost salvata!',
									type: 'success-template'
							};
							app.trigger('app:show:notification',opt);
					},
					error: function(model, response) {
							// we get the errors as a string. This was implemented so that we can show
							// both errors comming from server and from client. We modded the validate
							// function of the model so that it returns a JSON string containing an element named errors
							// from server we get the same result
							if (Number(response.status) !== 403 && Number(response.status) !== 401) {
									var data = eval('(' + response.responseText + ')');
									//app.Util.showErrors(model, data);
									/*if(self.model.get('transfered')===8){
									self.model.set('transfered',9);
									}*/
									//self.showErrors(model, response);
									w2utils.validateRaw($(self.el), data);
							} else {

							}
					}
			};
			if (self.validate()) {
					self.model.save({}, options);
			}
	}

	validate() {
			if (this.model.get('newpass')) {
					var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
					if (!re.test(this.model.get('newpass'))) {
							var data = [{
									name: 'newpass',
									message: 'Minim 6 caractere, o cifra si un caracter majuscul'
							}];
							app.trigger('app:show:error',data);
							return false;
					}
					if (this.model.get('confirmedpass') != this.model.get('newpass')) {
							var data = [{
									name: 'confirmedpass',
									message: 'Valoarea introdusa nu este identica cu parola de mai sus'
							}];
							app.trigger('app:show:error',data);
							return false;
					}
			}
			if (!w2utils.validate(this.model, this.$el)) {
					return false;
			}
			return true;
	}
	onBeforeDestroy(){
			w2ui.userContainer.destroy();
			//w2ui.gridReprezentanti.destroy();
	}
}
