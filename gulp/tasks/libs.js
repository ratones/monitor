var gulp = require('gulp');
var config = require('../config').libs;
var concat = require('gulp-concat');

gulp.task('libs', function() {
  return gulp.src(config.src)
        .pipe(concat(config.name))
        .pipe(gulp.dest(config.dest));
});