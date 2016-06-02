var gulp = require('gulp');
var sass = require('gulp-sass');
var replace = require('gulp-replace');
var webpack = require('webpack-stream');
var gulpWatch = require('gulp-watch');
var del = require('del');

var PROD = JSON.parse(process.env.PROD || '0');

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
gulp.task('watch', ['sass', 'templates', 'webpack'], function(){
  gulpWatch('app/**/*.html', function(){ gulp.start('templates'); });
  gulpWatch('sass/**/*', function(){ gulp.start('sass'); });
  gulpWatch('app/**/*.ts', function(){ gulp.start('webpack'); });

});

gulp.task('styles', ["sass"], function () {
  return gulp.src(target.css+"/*")
  .pipe(gulp.dest("./build/webpack/prod/styles"));
});
gulp.task('sass', ["fonts"], function () {
  return gulp.src('./sass/main.scss')
    .pipe(sass({outputStyle: PROD ?'compressed':null}).on('error', sass.logError))
    .pipe(gulp.dest(target.css));
});
gulp.task("fonts", function(){
  return gulp.src(paths.ng2material+'/MaterialIcons*')
  .pipe(gulp.dest(target.css));
})
gulp.task("clear", function(){
  return del(['build/webpack/prod/*.js'])
})

// gulp.task('js', function (done) {
//     var js = [
//         paths.fetch + "*.js",
//         paths.shim + "*.min.js",
//         paths.systemjs + "*.js",
//         paths.rxjs + "*.min.js",
//         paths.ng2material + "*.js",
//         paths.angular + "*.js"
//     ];
//     js = js.concat(js.map(function (item) {
//         return item + ".map"
//     }));
//     gulp.src(js)
//         .pipe(gulp.dest(target.js))
//         .on('end', done);
// })

gulp.task('webpack', ['clear'], function(done){
  return gulp.src('src/boot.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./build/webpack/prod'));
})
gulp.task("templates", function(){
  gulp.src('./app/**/*.html')
  .pipe(gulp.dest('./build/webpack/prod/app'));
})

// gulp.task('default', ['js', 'sass']);

gulp.task('build', ['styles', 'templates', 'webpack']);
