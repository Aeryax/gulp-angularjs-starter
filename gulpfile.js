var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var browserSync = require('browser-sync').create();

/**
* ================================================
* Public Tasks
* ================================================
**/

// gulp serve
gulp.task('serve', gulp.series(
  compileSass,
	gulp.parallel(autoreload, watch)
));

// gulp build
gulp.task('build', gulp.series(
	cleanDistFolder,
	gulp.parallel(compileCssAndJs, minimizeImages, moveFonts)
));

// gulp clean
gulp.task('clean', gulp.parallel(
	cleanDistFolder
));

// gulp test-unit
gulp.task('test-unit', gulp.series(

));

// gulp e2e
gulp.task('test-e2e', gulp.series(

));

// gulp doc-markdown
gulp.task('doc-markdown', gulp.series(

));

// gulp doc-html
gulp.task('doc-html', gulp.series(

));


/**
* ================================================
* Private Tasks
* ================================================
**/

function cleanDistFolder() {
	return del(['dist']);
}

function moveFonts() {
	return gulp.src('src/assets/fonts/**/*')
		.pipe(gulp.dest('dist/assets/fonts'));
}

function watch() {
	gulp.watch('src/assets/scss/*.{scss,sass}', compileSass);
	gulp.watch('src/**/*.html', browserSync.reload);
	gulp.watch('src/assets/js/**/*.js', browserSync.reload);
	gulp.watch('src/assets/css/**/*.css', browserSync.reload);
}

function compileSass() {
	return gulp.src('src/assets/scss/*.{scss,sass}')
    	.pipe(plugins.sass())
    	.pipe(gulp.dest('src/assets/css/build'));
}

function compileCssAndJs() {
	return gulp.src('src/*.html')
    	.pipe(plugins.useref())
    	// js actions
    	.pipe(plugins.if('*.js', plugins.uglify()))
    	// css actions
    	.pipe(plugins.if('*.css', plugins.cssnano()))
    	.pipe(gulp.dest('dist'));
}

function autoreload() {
	browserSync.init({
		server: {
			baseDir: 'src'
		},
	});
}

function minimizeImages() {
	return gulp.src('src/assets/img/**/*.+(png|PNG|jpg|JPG|gif|GIF|svg|SVG)')
		.pipe(plugins.cache(plugins.imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest('dist/assets/img'));
}
