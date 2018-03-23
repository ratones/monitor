var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var merge = require('merge-stream');
var exec = require('child_process').exec;
var fs = require('fs');
var del = require('rimraf');

gulp.task('clean-dist', function() {
    del('dist/**/*',function(){
      console.log('dist folder cleaned');
    });
});
gulp.task('clean-release', function() {
    del('release/**/*');
});

gulp.task('compress', function() {
    return gulp.src('build/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
    return gulp.src('build/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
    var node = gulp.src(['node_modules/request/**/*',
            //'node_modules/ipc/**/*',
            // 'node_modules/ncp/**/*',
            // 'node_modules/semver/**/*',
            'node_modules/rimraf/**/*',
            'node_modules/node-webkit-updater/**/*'
        ], {
            base: 'node_modules'
        })
        .pipe(gulp.dest('dist/node_modules'));
    var assets = gulp.src('src/www/**/*')
        .pipe(gulp.dest('dist'));
    var pack = gulp.src(['key.pfx'])
        .pipe(gulp.dest('dist'));
    return merge(node, assets, pack);
});

gulp.task('flatten', ['copy'], function(cb) {
    exec('flatten-packages dist', function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('setVersion', function() {
    var appversion, i = process.argv.indexOf("--appversion");
    var appPath = '';
    //var mainPackageJSON = grunt.file.readJSON('package.json');
    var appPackageJSON = JSON.parse(fs.readFileSync(appPath + 'package.json'));
    if (i > -1) {
        appversion = process.argv[i + 1];
    } else {
        var currVers = appPackageJSON.version.split(/[.]+/);
        var version = Number(currVers[0]);
        var release = Number(currVers[1]);
        var modif = Number(currVers[2]);
        modif = modif + 1;
        appversion = version + '.' + release + '.' + modif;
        console.log(modif);
    }
    appPackageJSON.version = appversion;
    fs.writeFileSync('package.json', JSON.stringify(appPackageJSON, null, "\t"));
});

gulp.task('writePackage', function() {
    var appPackageJSON = JSON.parse(fs.readFileSync('package.json'));
    appPackageJSON.main = 'index.html';
    appPackageJSON.dependencies = {};
    fs.writeFileSync('dist/package.json', JSON.stringify(appPackageJSON, null, "\t"));
});


gulp.task('dist', ['writePackage','compress', 'minify-css', 'flatten']);
