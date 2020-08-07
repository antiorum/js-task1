const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const browserify = require('browserify');
const babel = require('gulp-babel');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const babelify = require('babelify');
const sourcemaps = require('gulp-sourcemaps');

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
  return src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(concat('app.min.css'))
    .pipe(cleanCSS())
    .pipe(dest('dist/css/'))
    .pipe(browserSync.stream());
}

function scripts() {
  return browserify('app/js/main.js',{ debug:true }).transform(babelify, {
    presets: [ '@babel/preset-env' ],
    plugins: [ '@babel/transform-runtime' ],
    sourceMaps: true
  }).bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(rename('main.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
}

function compilepug() {
  return src('app/pug/index.pug')
    .pipe(pug())
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}

function startwatch() {
  watch([ 'app/pug/**/*.pug' ], compilepug);
  watch([ 'app/sass/**/*.sass' ], styles);
  watch([ 'app/images/*.png' ], images);
  watch([ 'app/js/*.js' ], scripts);
}

exports.default = parallel(images, styles, scripts, compilepug, browsersync, startwatch);
