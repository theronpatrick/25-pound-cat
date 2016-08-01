// TODO: Remove unneeded requirements
var gulp = require('gulp');
var del = require('del');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');

var webserver = require('gulp-webserver');
var gutil = require('gulp-util');
var rename = require("gulp-rename");
var gulpSequence = require("gulp-sequence");

// Directory for styles
var stylesDir = 'src/styles';

// Movie data
var movieData = require("./src/js/data/data.json");

gulp.task('sass', function() {
	gutil.log('Building styles');
	return gulp.src(stylesDir + '/app.scss')
	.pipe(sass().on('error', sass.logError))
	// Save to both dev and build folders (probably would be split into two different tasks for larger project)
	.pipe(gulp.dest(stylesDir))
	.pipe(gulp.dest("build"));
});
 
gulp.task('watch', function () {
  gulp.watch(stylesDir + '/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['js']);
  gulp.watch('src/**/*.ejs', ['ejs']);
});

gulp.task('clean:sass', function() {
	gutil.log('Cleaning old styles');
	return del('src/styles/app.css');
});

// Could minify js here if we really wanted to
gulp.task('js', function() {
	return gulp.src("src/js/**/*")
	.pipe(gulp.dest("build/js/"));
});

gulp.task('img', function() {
	gutil.log('In img');
	return gulp.src("src/img/**/*")
	.pipe(gulp.dest("build/img/"));
});

gulp.task('ejs', function() {

	gutil.log('Building ejs files');
	gulp.src("src/views/pages/index.ejs")
	.pipe(ejs({
		title: "IOMGDb",
		rmWhitespace: true,
		movies: movieData.media
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
gulp.task('build', gulpSequence('clean:build', 'ejs', 'sass', 'img', 'js', 'serve', 'watch')
);

// The default task (called when we run `gulp` from cli)
gulp.task('default', ['build'], function() {
	gutil.log('In default callback');
});
