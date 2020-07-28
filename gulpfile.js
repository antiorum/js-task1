const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');

function browsersync() {
  browserSync.init({
    server: { baseDir: 'dist/' },
    notify: false
  });
}

function images() {
  return src('app/images/*.png')
    .pipe(dest('dist/images/'));
}

function styles() {
  return src('app/sass/*.sass')
    .pipe(sass())
    .pipe(concat('app.min.css'))
    .pipe(cleanCSS())
    .pipe(dest('dist/css/'));
}

function scripts() {
  return src([
    'app/js/*.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('dist/js/'))
    .pipe(browserSync.stream());
}

function compilepug() {
  return src('app/pug/index.pug')
    .pipe(pug())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}

function startwatch() {
  watch([ 'app/pug/*.pug' ], compilepug);
  watch([ 'app/sass/*.sass' ], styles);
  watch([ 'app/images/*.png' ], images);
  watch([ 'app/js/*.js', '!app/js/*.min.js' ], scripts);
  watch('app/*.html').on('change', browserSync.reload);
}


exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.pug = compilepug;

exports.default = parallel(images, styles, scripts, compilepug, browsersync, startwatch);
