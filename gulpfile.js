const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const cssNano = require('gulp-cssnano');
const image = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const useref = require('gulp-useref');
const gulpif = require('gulp-if');
const cache = require('gulp-cache');
const pug = require('gulp-pug');
//
const path = {
  images: {
    src: './assets/images/**/*.+(png|jpg|gif|svg)',
    dest: 'dist/images',
  },
  scssTask: {
    src: './assets/scss/**/*.scss',
    dest: './assets/css',
  },
  cssTask: {
    src: './assets/css/**/*.css',
    dest: 'dist/css',
  },
  jsTask: {
    src: './assets/js/**/*.js',
    dest: 'dist/js',
  },
  pug: {
    src: './assets/pug/*.pug',
    dest: './assets/',
  },
  vendor: {
    src: ['./assets/vendor/**'],
    dest: ['dist/vendor'],
  },
  font: {
    src: ['./assets/font/**'],
    dest: ['dist/font'],
  },
  output: 'dist',
};

function clean() {
  return del([path.output]);
}
function vendor() {
  for (let i = 0; i < path.font.src.length; i++) {
    src(path.font.src[i]).pipe(dest(path.font.dest[i]));
    return src(path.font.src);
  }
}
function imageWebp() {
  src('./assets/images/**/*.webp').pipe(dest('dist/images'));
  return src('./assets/images/**/*.webp');
}
function font() {
  for (let i = 0; i < path.vendor.src.length; i++) {
    src(path.vendor.src[i]).pipe(dest(path.vendor.dest[i]));
    return src(path.vendor.src);
  }
}
function browserSyncInit() {
  console.log('browserSyncInit');
  return browserSync.init({
    server: {
      baseDir: './assets/',
      index: 'index.html',
    },
  });
}
function pugTask() {
  return src(path.pug.src)
    .pipe(
      pug({
        doctype: 'html',
        pretty: true,
      })
    )
    .pipe(browserSync.stream())
    .pipe(dest('./assets/'));
}
function sassTask() {
  return src(path.scssTask.src)
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ['last 3 versions', 'iOS >= 8', 'Safari >= 8', 'ie 11'],
      })
    )
    .pipe(browserSync.stream())
    .pipe(dest('./assets/css'));
}
function dev() {
  // clean();
  // series(sassTask, parallel(browserSyncInit, userefTask))();
  browserSyncInit();
  watch(path.scssTask.src, series(sassTask, userefTask)).on('change', browserSync.reload);
  watch(path.jsTask.src, userefTask).on('change', browserSync.reload);
  watch(path.pug.src, series(pugTask));
  watch('./assets/*html').on('change', browserSync.reload);

  // watch("./assets/images",imageTask).on('change',browserSync.reload);
}
// image watch
function imageTask() {
  return src('./assets/images/**/*.+(png|jpg|gif|svg|webp)')
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}
// image watch
function userefTask() {
  return src('./*.html')
    .pipe(useref())
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}
function minfyJsAndCss() {
  return (
    src('./assets/*.html')
      // .pipe(sourcemaps.init())
      .pipe(useref())
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulpif('*.css', cssNano()))
      .pipe(dest(path.output))
  );
}
function minfyImages() {
  return src(path.images.src)
    .pipe(
      image({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true,
      })
    )
    .pipe(dest(path.images.dest))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
}
const pro = series(clean, font, sassTask, vendor, imageWebp, parallel(minfyJsAndCss, minfyImages));
exports.clean = clean;
exports.dev = dev;
exports.pro = pro;
exports.vendor = vendor;
exports.font = font;
exports.imageWebp = imageWebp;
