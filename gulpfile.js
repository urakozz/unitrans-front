var gulp = require('gulp');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var webpack = require('webpack-stream');

var target = {
    js: "./build/vendor",
    css: "./build/styles"
};
var paths = {
    'fetch': './node_modules/whatwg-fetch/',
    'rxjs': './node_modules/rxjs/bundles/',
    'shim': './node_modules/es6-shim/',
    'systemjs': './node_modules/systemjs/dist/',
    'ng2material': './node_modules/ng2-material/dist/',
    'angular': './node_modules/angular2/bundles/'
};

gulp.task('sass', ["fonts"], function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(target.css));
});
gulp.task("fonts", function(){
  gulp.src(paths.ng2material+'/MaterialIcons*')
  .pipe(gulp.dest(target.css));
})

gulp.task('js', function (done) {
    var js = [
        paths.fetch + "*.js",
        paths.shim + "*.min.js",
        paths.systemjs + "*.js",
        paths.rxjs + "*.min.js",
        paths.ng2material + "*.js",
        paths.angular + "*.js"
    ];
    js = js.concat(js.map(function (item) {
        return item + ".map"
    }));
    gulp.src(js)
        .pipe(gulp.dest(target.js))
        .on('end', done);

})

gulp.task('webpack', function(done){
  return gulp.src('src/entry.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/'));
})

gulp.task('default', ['js', 'sass']);
