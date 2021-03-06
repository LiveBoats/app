var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');
var useref = require('gulp-useref');


var defaultFilter = {
    sass: ['src/sass/**/*.+(sass|scss)'],
	html: ['src/index.html']
};

var defaultPath = {
    css: 'src/css',
    maps: './maps',
	dist: 'www'
};

var onError = {
    errorHandler: function (err) {
        console.log(err);
        this.emit('end');
    }
};

gulp.task('sass', function () {
    return gulp.src(defaultFilter.sass)
        .pipe(plumber(onError))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(defaultPath.maps))
        .pipe(gulp.dest(defaultPath.css))
});

gulp.task('watch', function(){
    gulp.watch(defaultFilter.sass, ['sass']).on('change', gutil.log);
});

gulp.task('dist', ['sass'], function () {
	return gulp.src(defaultFilter.html)
		.pipe(useref())
		.pipe(gulp.dest(defaultPath.dist));

});
