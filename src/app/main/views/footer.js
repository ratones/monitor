import template from './../templates/footer.html';

export default class FooterView extends Mn.View {
    constructor(props) {
        super(props);
        this.template = template;
    }
    onAttach() {
        var self = this;
    }
}
