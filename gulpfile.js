var gulp = require('gulp'),
    notify = require("gulp-notify"),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso = require('gulp-csso'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    clean = require('gulp-dest-clean'),
    gulpSequence = require('gulp-sequence'),
    browserSync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include');

/* Compile sass */
gulp.task('styles', function () {
  return gulp.src('./dev/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 4 versions']}))
    .pipe(gulp.dest('./prod/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(csso())
    .pipe(gulp.dest('./prod/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(browserSync.reload({stream: true}));
});

/* Scripts */
gulp.task('scripts', function() {
    return gulp.src(['./dev/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./prod/js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js/'))
        .pipe(gulp.dest('./node_modules/bootstrap-sass/assets/javascript/bootstrap.js'))
        .pipe(concat('bootstrap.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./prod/js/'))
        .pipe(notify({ message: 'Scripts task complete' }))
        .pipe(browserSync.reload({stream: true}));
});

/* Minify image */
gulp.task('images', () =>
    gulp.src('./dev/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./prod/images'))
);

/* Fonts to Dist */

gulp.task('fonts', function() {
    gulp.src('./dev/fonts/*.*')
    .pipe(gulp.dest('./prod/fonts'));
});

/* Clean Prod Dir */
gulp.task('clean', function() {
	return gulp.src('./dev')
	.pipe(clean('./prod'));
});

/* Browser synh */
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./prod/"
        }
    });
});

/* File includes */
gulp.task('html', function() {
  gulp.src('./dev/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./prod/'));
});

/* Build */
gulp.task('build', gulpSequence('clean', 'fonts', 'styles', 'scripts', 'images', 'html', 'browser-sync'));


/* Watcher */

gulp.task('watch', ['browser-sync'] ,function() {
    gulp.watch('./dev/sass/*.scss', ['styles']);
    gulp.watch('./dev/*.html', ['html']);
    gulp.watch('./dev/js/main.js', ['scripts']);
    gulp.watch('./prod/*.html').on("change", browserSync.reload);
});