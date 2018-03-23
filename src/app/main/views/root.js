import Toolbar from './toolbar';
import Footer from './footer';

export default class RootView extends Mn.View {
    constructor() {
        super();
        this.template = _.template('Main');
        this.className = 'fullscreen';
    }

    onAttach() {
        this.$el.html(`<div id="navigation"></div>
                        <div id="main"></div>
                        <div id="footer"></div>`);
        // var modalRegion = new Mn.ModalRegion({el:'#modalContainer'});
        //create application regions
        this.addRegions({
            'menu': '#navigation',
            'container': '#main',
            // 'sidebar':'#sidebar',
            // 'modal': modalRegion,
            'footer': '#footer'
        });

        /*----------  Adding Toolbar and Footer  ----------*/
        this.showChildView('menu', new Toolbar());
        this.showChildView('footer', new Footer());
        // var sidebar = new Sidebar();
        // app.sidebar = sidebar;
        // this.showChildView('sidebar', sidebar);
        /*=====  End of Application main layout  ======*/

        // Scroll to top button appear
        $(document).scroll(function () {
            var scrollDistance = $(this).scrollTop();
            if (scrollDistance > 100) {
                $('.scroll-to-top').fadeIn();
            } else {
                $('.scroll-to-top').fadeOut();
            }
        });
        // Configure tooltips globally
        // $('[data-toggle="tooltip"]').tooltip()
        // Smooth scrolling using jQuery easing
        $(document).on('click', 'a.scroll-to-top', function (event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: ($($anchor.attr('href')).offset().top)
            }, 1000, 'easeInOutExpo');
            event.preventDefault();
        });
    }


}
