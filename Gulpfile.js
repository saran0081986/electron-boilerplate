var gulp        = require('gulp');
var browserSync = require('browser-sync')
    .create();

var concat   = require('gulp-concat');
var cssnano  = require('gulp-cssnano');
var del      = require('del');
var glob     = require('glob');
var htmlmin  = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var jade     = require('gulp-jade');
var postcss  = require('gulp-postcss');
var sass     = require('gulp-sass');
var uglify   = require('gulp-uglify');

var config = {
    using: {
        css : false,
        scss: true,
        html: false,
        jade: true
    }
};

var paths = {
    src                   : {
        dir : "src",
        jade: "src/jade",
        html: "src/html",
        js  : "src/js",
        scss: "src/scss",
        css : "src/css",
        img : "src/img"
    },
    dist                  : {
        dir : "dist",
        html: "dist",
        js  : "dist/assets/js",
        css : "dist/assets/css",
        img : "dist/assets/img"
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
    require("postcss-sprites")
        .default({
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
if (config.using.scss) {
    gulp.task("scss:compile", function () { // Returns stream for synchronous execution
        return gulp.src(paths.src.scss + "/**/*.scss")
                   .pipe(sass()
                       .on('error', sass.logError))
                   .pipe(gulp.dest(paths.src.css));
    });
}
gulp.task("css:compute", (config.using.scss) ? ["scss:compile"] : [], function () {
    gulp.src([paths.src.css + "/**/*.css", "!" + paths.src.css + "/" + paths.aloneDirName + "/**/*.css"])
        .pipe(postcss(postcssProcessors))
        .pipe(cssnano())
        .pipe(concat(paths.concatenatedFileName + ".css"))
        .pipe(gulp.dest(paths.dist.css))
        .pipe(browserSync.stream());
});
gulp.task("css:computeAlone", (config.using.scss) ? ["scss:compile"] : [], function () {
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
 * HTML
 */
if (config.using.jade) {
    gulp.task("jade:compile", function () { // Returns stream for synchronous execution
        return gulp.src([paths.src.jade + "/**/*.jade", "!" + paths.src.jade + "/**/_*.jade"])
                   .pipe(jade({pretty: '    '}))
                   .pipe(gulp.dest(paths.src.html));
    });
}
gulp.task("html:minify", (config.using.jade) ? ["jade:compile"] : [], function () {
    gulp.src(paths.src.html + "/**/*.html")
        .pipe(htmlmin({collapseWhitespace: true, removeComments: true, minifyCSS: true, minifyJS: {mangle: false}}))
        .pipe(gulp.dest(paths.dist.html));
});

/*
 * Clean
 */
var clean = [
    paths.dist.css + "/**/*.css",
    paths.dist.img + "/**/*." + paths.imageExtensions,
    paths.dist.js + "/**/*.js",
    paths.dist.html + "/**/*.html"
];
if (!config.using.css) {
    clean.push(paths.src.css + "/**/*.css");
}
if (!config.using.html) {
    clean.push(paths.src.html + "/**/*.html");
}
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
    if (config.using.scss) {
        gulp.watch(paths.src.scss + "/**/*.scss", ["scss"]);
    }
    gulp.watch(paths.src.css + "/**/*.css", ["css"]);
    gulp.watch([
            paths.src.img + "/**/*." + paths.imageExtensions,
            "!" + paths.src.img + "/" + paths.imagesToSpritesDirName + "/**/*." + paths.imageExtensions
        ],
        ["img"]);
    gulp.watch(paths.src.js + "/**/*.js", ["js"]);
    if (config.using.jade) {
        gulp.watch(paths.src.jade + "/**/*.jade", ["jade"]);
    }
    gulp.watch(paths.src.html + "/**/*.html", ["html"]);
});

/*
 * BrowserSync
 */
gulp.task("browserSync:serve", function () {
    browserSync.init({
        server         : paths.dist.dir,
        open           : false,
        reloadOnRestart: true
    });
    gulp.watch(paths.dist.html + "/**/*.html")
        .on('change', browserSync.reload);
    gulp.watch(paths.dist.js + "/**/*.js")
        .on('change', browserSync.reload);
});

/*
 * Tasks
 */
gulp.task("init", ["dependencies:load"]);
if (config.using.scss) {
    gulp.task("scss", ["scss:compile"]);
}
gulp.task("css", ["css:compute", "css:computeAlone"]);
gulp.task("img", ["img:compute"]);
gulp.task("js", ["js:compute", "js:computeAlone"]);
if (config.using.jade) {
    gulp.task("jade", ["jade:compile"]);
}
gulp.task("html", ["html:minify"]);
var build = [];
if (config.using.scss) {
    build.push("scss");
}
build.push("css", "img", "js");
if (config.using.jade) {
    build.push("jade");
}
build.push("html");
gulp.task("build", build);
gulp.task("default", ["build", "watch", "browserSync:serve"]);