var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var fs = require('fs');
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

// gulp build-zip
gulp.task('build-zip', gulp.series(
  gulp.parallel(cleanDistFolder, cleanZip),
	gulp.parallel(compileCssAndJs, minimizeImages, moveFonts),
	zip
));

// gulp clean-zip
gulp.task('clean-zip', cleanZip);


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


function zip() {
	if (fs.existsSync(__dirname + '/dist')) {
		var name = require(__dirname + '/package.json').name;
		var version = require(__dirname + '/package.json').version;

		var buildDate = new Date();
		var yyyy = buildDate.getFullYear();
		var mm = buildDate.getMonth() < 9 ? '0' + (buildDate.getMonth() + 1) : (buildDate.getMonth() + 1);
		var dd  = buildDate.getDate() < 10 ? '0' + buildDate.getDate() : buildDate.getDate();
		var hh = buildDate.getHours() < 10 ? '0' + buildDate.getHours() : buildDate.getHours();
		var min = buildDate.getMinutes() < 10 ? '0' + buildDate.getMinutes() : buildDate.getMinutes();
		var ss = buildDate.getSeconds() < 10 ? '0' + buildDate.getSeconds() : buildDate.getSeconds();

		return gulp.src('dist/**/*')
			.pipe(plugins.zip(name + '-' + version + '-' + yyyy + mm + dd + '-' + hh + min + ss + '.zip'))
			.pipe(gulp.dest('.'));

	} else {
		throw new plugins.util.PluginError({
			plugin: 'archive',
			message: 'build directory is empty, you should start gulp build'
		});
	}

}

function cleanZip() {
	var name = require(__dirname + '/package.json').name;
	return del([name + '-*' + '.zip']);
}


/**
* ================================================
* Helpers
* ================================================
**/

var showError = function(task) {
	return function(err) {
		plugins.util.log(plugins.util.colors.bgRed(task + ' error:'), plugins.util.colors.red(err));
	};
};

var showSuccess = function(task) {
	return function(msg) {
		plugins.util.log(plugins.util.colors.bgGreen(task + ' :'), plugins.util.colors.green(msg));
	};
};
