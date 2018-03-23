var gulp = require('gulp');

gulp.task('build', ['libs','browserify','css','scss', 'markup']);
