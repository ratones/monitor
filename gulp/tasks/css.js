var gulp = require('gulp');
var config = require('../config').css;
var concatCss = require('gulp-concat-css');

gulp.task('css', function() {
  return gulp.src(config.src)
        .pipe(concatCss("bundle.css"))
        .pipe(gulp.dest(config.dest));
});