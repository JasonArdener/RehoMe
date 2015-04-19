/// <vs SolutionOpened='default' />
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var cssmin = require('gulp-cssmin');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var spritesmith = require('gulp.spritesmith');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var reload      = browserSync.reload;
//var browserify = require('gulp-browserify'); 


gulp.task('compass', function() {
  gulp.src('./assets/scss/*.scss')
    .pipe(sourcemaps.init())
    .pipe(compass({
      css: './assets/css',
      sass: './assets/scss',
    }))
    .pipe(autoprefixer({
        browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
        cascade: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(cssmin())
    .pipe(gulp.dest('./assets/css/'));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('./assets/js/modules/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// gulp.task('jscs', function() {
//     return gulp.src('./assets/js/modules/**/*.js')
//         .pipe(jscs());
// });

gulp.task('uglify', function() {
  gulp.src(['./assets/js/modules/**/*.js'])
            
    .pipe(sourcemaps.init())
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest("./assets/js/"));
});

gulp.task('spritesmith', function() {
    var spriteData = 
        gulp.src(['./assets/sprite/*.png', '!./assets/sprite/spritesheet.png']) // source path of the sprite images
            .pipe(spritesmith({
                imgName: 'spritesheet.png',
                cssName: '_sprites.scss',
            }));

    spriteData.img.pipe(gulp.dest('./assets/sprite/')); // output path for the sprite
    spriteData.css.pipe(gulp.dest('./assets/scss/modules/')); // output path for the CSS
});

// start server
gulp.task('browser-sync', function() {
    browserSync({
        proxy: "http://localhost:24239/"
    });
});


// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./assets/js/modules/**/*.js', ['uglify', 'lint']);
    gulp.watch('./assets/scss/**/*.scss', ['compass']);
    gulp.watch("./assets/css/Site.css").on('change', reload);
});

// Default Task
gulp.task('default', ['browser-sync', 'lint', 'compass', 'uglify', 'watch']);