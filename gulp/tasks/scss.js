var gulp = require('gulp');
var config = require('../config').scss;
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

gulp.task('css:compile', function() {
  return gulp.src(config.src)
    .pipe(sass.sync({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest(config.compile))
});
// Minify CSS
gulp.task('css:minify', ['css:compile'], function() {
  return gulp.src([
      config.compile + '*.css',
      '!' + config.compile + '*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.dest))
    // .pipe(browserSync.stream());
});
// CSS
gulp.task('scss', ['css:compile', 'css:minify']);