import template from './../templates/home.html';
import Campaings from './campaigns';

export default class Home extends Mn.View{
	constructor(){
		super({
			className:'frontpage'
		});
		this.template = template;
	}

	onAttach(){
		this.addRegions({
			'campaigns':'#campaigns-card'
		});
		//show campaigns cards
		this.showChildView('campaigns', new Campaings());
	}
}
