const {src, dest, parallel, series, watch} = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const del = require('del');

function browsersync() {
    browserSync.init({
        server: {baseDir: 'app/'},
        notify: false
    })
}

function styles() {
    return src('app/sass/main.sass')
        .pipe(sass())
        .pipe(concat('app.min.css'))
        .pipe(dest('app/css/'))
}

function scripts() {
    return src([
        'app/js/class.js',
        'app/js/app.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(dest('app/js/'))
        .pipe(browserSync.stream())
}

function startwatch() {
    watch(['app/sass/*.sass'], styles);
    watch(['app/js/*.js', '!app/js/*.min.js'], scripts);
    watch('app/*.html').on('change', browserSync.reload);
}

function cleandist() {
    return del('dist/**/*', {force: true});
}

function copybuild() {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/*.html'
    ], {
        base: 'app'
    }).pipe(dest('dist'))
}

exports.browsersync = browsersync;
exports.scripts = scripts;
exports.build = series(cleandist, styles, scripts, copybuild);

exports.default = parallel(styles, scripts, browsersync, startwatch);
