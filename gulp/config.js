var dest = './build',
  src = './src'

module.exports = {
  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [dest, src]
    },
    files: [
      dest + '/**'
    ]
  },
  libs:{
    src:[
        './node_modules/jquery/dist/jquery.js',
        './node_modules/underscore/underscore.js',
        './node_modules/backbone/backbone.js',
        './node_modules/backbone.radio/build/backbone.radio.js',
        './node_modules/backbone.marionette/lib/backbone.marionette.js',
        './libs/backbone-associate/src/backbone.associate.js',
        './libs/bootstrap-fileinput/js/fileinput.js',
        './libs/stickit/backbone.stickit.js',
        './libs/bootstrap/js/bootstrap.bundle.min.js',
        './libs/jquery-easing/jquery.easing.min.js',
        './libs/chart.js/Chart.min.js',
        './libs/datatables/jquery.dataTables.js',
        './libs/datatables/dataTables.bootstrap4.js',
        './node_modules/moment/min/moment-with-locales.js',
        './libs/bootstrap-datepicker/build/js/tempusdominus-bootstrap-4.js',
        './libs/bootstrap-alert-master/dist/js/bootstrap-alert.min.js',
        './libs/extensions/**'
      ],
      name:'bundles.js',
      dest:dest
  },
  markup: {
    src: src + "/www/**",
    dest: dest
  },
  scss:{
    src:[src + '/scss/**/*.scss'],
    compile:src + '/css/',
    dest:dest
  },
  css:{
    src: [
      './libs/bootstrap/css/bootstrap.min.css',
      './libs/font-awesome/css/font-awesome.css',
      './libs/datatables/dataTables.bootstrap4.css',
      './libs/bootstrap-alert-master/dist/css/bootstrap-alert.min.css',
      './libs/bootstrap-fileinput/css/fileinput.css',
      // './libs/bootstrap-datepicker/build/css/tempusdominus-bootstrap-4.css',
        ],
    dest:dest
  },
  browserify: {
    // Enable source maps
    //debug: true,
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [
      {
        entries: src + '/app/app.js',
        dest: dest,
        outputName: 'app.js'
      }
    ],
    extensions: ['.jsx'],
  }
};
