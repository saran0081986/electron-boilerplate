var gulp        = require("gulp");
var browserSync = require('browser-sync')
	.create();

var concat   = require('gulp-concat');
var cssnano  = require('gulp-cssnano');
var del      = require('del');
var glob     = require('glob');
var imagemin = require('gulp-imagemin');
var postcss  = require('gulp-postcss');
var sass     = require('gulp-sass');
var uglify   = require('gulp-uglify');

var paths = {
	src                   : {
		dir : "src",
		js  : "src/js",
		scss: "src/scss",
		css : "src/css",
		img : "src/img"
	},
	dist                  : {
		dir: "dist",
		js : "dist/assets/js",
		css: "dist/assets/css",
		img: "dist/assets/img"
	},
	aloneDirName          : "alone",
	concatenatedFileName  : "min",
	imageExtensions       : "{png,PNG,jpg,jpeg,JPG,gif,svg}",
	imagesToSpritesDirName: "sprites",
	spritesFileName       : "sprites.png"
};

/*
 * Dependencies
 */
var dependencies = [
	{
		cwd : "node_modules/bourbon/app/assets/stylesheets",
		src : "**/*",
		dest: paths.src.scss + "/mixins/bourbon"
	},
	{
		cwd : "node_modules/bourbon-neat/app/assets/stylesheets",
		src : "**/*",
		dest: paths.src.scss + "/mixins/neat"
	},
	{
		cwd : "node_modules/jquery/dist/",
		src : "jquery.min.js",
		dest: paths.dist.js
	},
	{
		cwd : "node_modules/normalize.css/",
		src : "normalize.css",
		dest: paths.src.css
	}
];
gulp.task("dependencies:load", function () {
	dependencies.forEach(function (dependency) {
		gulp.src(dependency.cwd + "/" + dependency.src, {base: dependency.cwd})
		    .pipe(gulp.dest(dependency.dest));
	});
});

/*
 * CSS
 */
var postcssProcessors = [
	require("postcss-sprites")({
		stylesheetPath  : paths.dist.css,
		spritePath      : paths.dist.img + "/" + paths.spritesFileName,
		outputDimensions: true,
		filterBy        : function (image) {
			return /sprites/gi.test(image.url);
		}
	}),
	require("autoprefixer")({
		browsers: ["last 2 version"]
	})
];
gulp.task("scss:compile", function () { // Returns stream for synchronous execution
	return gulp.src(paths.src.scss + "/**/*.scss")
	           .pipe(sass()
		           .on('error', sass.logError))
	           .pipe(gulp.dest(paths.src.css));
});
gulp.task("css:compute", function () {
	gulp.src([paths.src.css + "/**/*.css", "!" + paths.src.css + "/" + paths.aloneDirName + "/**/*.css"])
	    .pipe(postcss(postcssProcessors))
	    .pipe(cssnano())
	    .pipe(concat(paths.concatenatedFileName + ".css"))
	    .pipe(gulp.dest(paths.dist.css))
	    .pipe(browserSync.stream());
});
gulp.task("css:computeAlone", function () {
	gulp.src(paths.src.css + "/" + paths.aloneDirName + "/**/*.css")
	    .pipe(postcss(postcssProcessors))
	    .pipe(cssnano())
	    .pipe(gulp.dest(paths.dist.css))
	    .pipe(browserSync.stream());
});

/*
 * IMG
 */
gulp.task("img:compute", function () {
	gulp.src([
		    paths.src.img + "/**/*." + paths.imageExtensions,
		    "!" + paths.src.img + "/" + paths.imagesToSpritesDirName + "/**/*." + paths.imageExtensions
	    ])
	    .pipe(imagemin({multipass: true}))
	    .pipe(gulp.dest(paths.dist.img));
});

/*
 * JS
 */
gulp.task("js:compute", function () {
	gulp.src([paths.src.js + "/**/*.js", "!" + paths.src.js + "/" + paths.aloneDirName + "/**/*.js"])
	    .pipe(uglify({mangle: false}))
	    .pipe(concat(paths.concatenatedFileName + ".js"))
	    .pipe(gulp.dest(paths.dist.js));
});
gulp.task("js:computeAlone", function () {
	gulp.src(paths.src.js + "/" + paths.aloneDirName + "/**/*.js")
	    .pipe(uglify({mangle: false}))
	    .pipe(gulp.dest(paths.dist.js));
});

/*
 * Clean
 */
var clean = [
	paths.dist.css + "/**/*.css",
	paths.dist.img + "/**/*." + paths.imageExtensions,
	paths.dist.js + "/**/*.js"
];
gulp.task("clean", function () {
	dependencies.forEach(function (dependency) {
		clean.push(dependency.dest + "/" + dependency.src);
	});
	del.sync(clean);

	var cleanDependenciesDir = [];
	dependencies.forEach(function (dependency) {
		if (glob.sync(dependency.dest + "/**/*").length == 0) {
			cleanDependenciesDir.push(dependency.dest);
		}
	});
	del.sync(cleanDependenciesDir);
});

/*
 * Watch
 */
gulp.task("watch", function () {
	gulp.watch(paths.src.scss + "/**/*.scss", ["scss"]);
	gulp.watch(paths.src.css + "/**/*.css", ["css"]);
	gulp.watch([
			paths.src.img + "/**/*." + paths.imageExtensions,
			"!" + paths.src.img + "/" + paths.imagesToSpritesDirName + "/**/*." + paths.imageExtensions
		],
		["img"]);
	gulp.watch(paths.src.js + "/**/*.js", ["js"]);
});

/*
 * BrowserSync
 */
gulp.task("browserSync:serve", function () {
	browserSync.init({
		server: paths.dist.dir
	});
	gulp.watch(paths.dist.dir + "/**/*.html")
	    .on('change', browserSync.reload);
	gulp.watch(paths.dist.js + "/**/*.js")
	    .on('change', browserSync.reload);
});

/*
 * Tasks
 */
gulp.task("init", ["dependencies:load"]);
gulp.task("scss", ["scss:compile"]);
gulp.task("css", ["css:compute", "css:computeAlone"]);
gulp.task("img", ["img:compute"]);
gulp.task("js", ["js:compute", "js:computeAlone"]);
gulp.task("default", ["scss", "css", "js", "watch", "browserSync:serve"]);
gulp.task("build", ["scss", "css", "img", "js"]);