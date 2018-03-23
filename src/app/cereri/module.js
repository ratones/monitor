import Controller from './controller';
import Config from './config';

export default class Cereri extends Mn.Object{
	constructor(){
		super();
		this.controller = new Controller();
		this.Config = Config;
	}
}