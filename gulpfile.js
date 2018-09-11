const fs = require('fs');
const gulp = require('gulp');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const minify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const header = require('gulp-header');
const sass = require('gulp-sass');


const SRC_DIR = 'src';
const SRC_DIR_JS = `${SRC_DIR}/js`;
const SRC_DIR_SCSS = `${SRC_DIR}/scss`;

const DIST_DIR = 'dist';
const DIST_DIR_JS = `${DIST_DIR}/js`;
const DIST_DIR_CSS = `${DIST_DIR}/css`;

const SRC_ENTRY_JS = [
  `${SRC_DIR_JS}/main.js`,
  `${SRC_DIR_JS}/libs/**/*.js`
];

const SRC_ENTRY_SCSS = [
  `${SRC_DIR_SCSS}/variables.scss`,
  `${SRC_DIR_SCSS}/functions.scss`,
  `${SRC_DIR_SCSS}/mixins.scss`,
  `${SRC_DIR_SCSS}/main.scss`,
  `${SRC_DIR_SCSS}/libs/**/*.scss`
];


function getCopyright() {
  return fs.readFileSync('./Copyright');
}


gulp.task('build-js', () => {
  const Copyright = getCopyright();

  return gulp.src(SRC_ENTRY_JS)
    .pipe(babel({ presets: ['env'] }))
    .pipe(concat('cyb.js'))
    .pipe(header(Copyright))
    .pipe(gulp.dest(DIST_DIR_JS))
    // Minify Output
    .pipe(minify({ compress: true }))
    .pipe(header(Copyright))
    .pipe(rename('cyb.min.js'))
    .pipe(gulp.dest(DIST_DIR_JS));
});

gulp.task('build-css', () => {
  const Copyright = getCopyright();
  
  return gulp.src(SRC_ENTRY_SCSS)
    .pipe(concat('cyb.css'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(header(Copyright))
    .pipe(gulp.dest(DIST_DIR_CSS))
    // Minify Output
    .pipe(rename('cyb.min.css'))
    .pipe(cleanCSS())
    .pipe(header(Copyright))
    .pipe(gulp.dest(DIST_DIR_CSS));
});


gulp.task('build', gulp.series(
  'build-js',
  'build-css'
));

gulp.task('watch', () => {
  gulp.watch(SRC_ENTRY_JS, gulp.series('build-js'));
  gulp.watch(SRC_ENTRY_SCSS, gulp.series('build-css'));
  gulp.watch('Copyright', gulp.series('build'));
});

gulp.task('start', gulp.series('build', 'watch'));
