const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const del = require('del');

function browsersync() {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false
  });
}

function styles() {
  return src('app/sass/*.sass')
    .pipe(sass())
    .pipe(concat('app.min.css'))
    .pipe(cleanCSS())
    .pipe(dest('app/css/'));
}

function scripts() {
  return src([
    'app/js/*.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js/'))
    .pipe(browserSync.stream());
}

function compilepug() {
  return src('app/pug/index.pug')
    .pipe(pug())
    .pipe(dest('app/'))
    .pipe(browserSync.stream());
}

function startwatch() {
  watch([ 'app/pug/*.pug' ], compilepug);
  watch([ 'app/sass/*.sass' ], styles);
  watch([ 'app/js/*.js', '!app/js/*.min.js' ], scripts);
  watch('app/*.html').on('change', browserSync.reload);
}

function cleandist() {
  return del('dist/**/*', { force: true });
}

function copybuild() {
  return src([
    'app/css/**/*.min.css',
    'app/js/**/*.min.js',
    'app/*.html',
    'app/images/*.png'
  ], {
    base: 'app'
  }).pipe(dest('dist'));
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.pug = compilepug;

exports.build = series(cleandist, styles, scripts, compilepug, copybuild);

exports.default = parallel(styles, scripts, compilepug, browsersync, startwatch);
