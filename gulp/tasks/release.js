var gulp = require('gulp');
var zip = require('gulp-zip');

gulp.task('package',function(){
   return gulp.src('package.json')
        .pipe(gulp.dest('release'));
});

gulp.task('archive',['package'],function() {
    return gulp.src('dist/**/*')
        .pipe(zip('app.zip'))
        .pipe(gulp.dest('release'));
});

gulp.task('release', ['build','dist','archive']);
