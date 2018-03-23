import template from './../templates/navigation.html'


export default class Toolbar extends Marionette.View {
    constructor(options) {
        super(options);
        this.template = template;
        if (app.Security.User) {
            this.bindings = {
                '#lblusername': 'displayname'
            };
            this.model = app.Security.User;
						this.listenTo(this.model,'change',this.buildMenu);
        }
        this.menu = [];
        this.autMenu = [];
        this.buildMenu();
    }
    onAttach() {
        $("#sidenavToggler").click(function(e) {
            e.preventDefault();
            $("body").toggleClass("sidenav-toggled");
            $(".navbar-sidenav .nav-link-collapse").addClass("collapsed");
            $(".navbar-sidenav .sidenav-second-level, .navbar-sidenav .sidenav-third-level").removeClass("show");
          });
          $(".navbar-sidenav .nav-link-collapse").click(function(e) {
            e.preventDefault();
            $("body").removeClass("sidenav-toggled");
          });
          $('body.fixed-nav .navbar-sidenav, body.fixed-nav .sidenav-toggler, body.fixed-nav .navbar-collapse').on('mousewheel DOMMouseScroll', function(e) {
            var e0 = e.originalEvent,
              delta = e0.wheelDelta || -e0.detail;
            this.scrollTop += (delta < 0 ? 1 : -1) * 30;
            e.preventDefault();
          });
    }
    //build application menu based on config menu object
    buildMenu() {
        
    }
    //recursevly append submenu items
    buildSubmenu(menu) {
        
    }
    //update menu when user status changes
    updateMenu() {

    }
}
