var gulp = require('gulp');
var target = {
    js: "./build/vendor"
};
var paths = {
    'fetch': './node_modules/whatwg-fetch/',
    'shim': './node_modules/es6-shim/',
    'systemjs': './node_modules/systemjs/dist/',
    'angular': './node_modules/angular2/bundles/'
};

gulp.task('js', function (done) {
    var js = [
        paths.fetch + "*.js",
        paths.shim + "*.js",
        paths.systemjs + "*.js",
        paths.angular + "*.js"
    ];
    js = js.concat(js.map(function (item) {
        return item + ".map"
    }));
    gulp.src(js)
        .pipe(gulp.dest(target.js))
        .on('end', done);

})

gulp.task('default', ['js']);
