// TODO: Remove unneeded requirements
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var del = require('del');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var ejs = require('gulp-ejs');

var webserver = require('gulp-webserver');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var gulpSequence = require("gulp-sequence");

// Directory for styles
var stylesDir = 'src/styles';

gulp.task('sass', function() {
	gutil.log('Building styles');
	return gulp.src(stylesDir + '/app.scss')
	.pipe(sass().on('error', sass.logError))
	// Save to both dev and build folders (probably would be split into two different tasks for larger project)
	.pipe(gulp.dest(stylesDir))
	.pipe(gulp.dest("build"));
});
 
gulp.task('sass:watch', function () {
  gulp.watch(stylesDir + '/**/*.scss', ['sass']);
});

gulp.task('clean:sass', function() {
	gutil.log('Cleaning old styles');
	return del('src/styles/app.css');
});

// TODO: Minify js if needed
gulp.task('js', function() {
	return gulp.src("src/js/**/*")
	.pipe(gulp.dest("build/js/"));
});

gulp.task('img', function() {
	gutil.log('In img');
	return gulp.src("src/img/**/*")
	.pipe(gulp.dest("build/img/"));
});

// TODO: Get EJS to live reload
gulp.task('ejs', function() {
	gutil.log('Building ejs files');
	gulp.src("src/views/pages/index.ejs")
	.pipe(ejs({
		title: "IOMGDb",
		rmWhitespace: true
	}))
	.pipe(rename("index.html"))
    .pipe(gulp.dest("build"));

});


// Run web server
gulp.task('serve', function() {
	gutil.log('Running server');
	gulp.src('build')
	.pipe(webserver({
	  livereload: {
	  	enable: true,
        filter: function(fileName) {
        	return true;
        }
      },
	  open: true
	}));
});

gulp.task('clean:build', function() {
	gutil.log('Cleaning old styles');
	return del('build');
});

// Compile assets
gulp.task('build', gulpSequence('clean:build', 'ejs', 'sass', 'img', 'js', 'serve', 'sass:watch')
);

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['build'], function() {
	gutil.log('In default callback');
});
