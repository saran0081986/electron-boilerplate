var gulp        = require('gulp');
var browserSync = require('browser-sync')
    .create();

var concat   = require('gulp-concat');
var cssnano  = require('gulp-cssnano');
var del      = require('del');
var glob     = require('glob');
var htmlmin  = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pug      = require('gulp-pug');
var postcss  = require('gulp-postcss');
var sass     = require('gulp-sass');
var uglify   = require('gulp-uglify');

var config = {
    using: {
        css : false,
        scss: true,
        html: false,
        pug : true
    }
};

var paths = {
    src                   : {
        dir : "src",
        pug : "src/pug",
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
    imageExtensions       : "{png,jpg,gif,svg}",
    imagesToSpritesDirName: "sprites"
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
gulp.task("dependencies:clean", function () {
    var clean = [];
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
 * CSS
 */
var postcssProcessors = [
    require("postcss-sprites")
        .default({
                     stylesheetPath: paths.dist.css,
                     spritePath    : paths.src.img,
                     filterBy      : function (image) {
                         if (!(new RegExp(paths.imagesToSpritesDirName, "gi")).test(image.url)) {
                             return Promise.reject();
                         }

                         return Promise.resolve();
                     }
                 }),
    require("autoprefixer")({
                                browsers: ["last 2 version"]
                            })
];
if (config.using.scss) {
    gulp.task("scss:compile", function () { // Returns stream for synchronous execution
        return gulp.src(paths.src.scss + "/**/*.scss")
                   .pipe(sass({
                                  indentWidth: 4,
                                  outputStyle: "expanded"
                              })
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
        .pipe(imagemin([
                           imagemin.gifsicle({
                                                 interlaced       : true,
                                                 optimizationLevel: 3
                                             }),
                           imagemin.jpegtran({
                                                 progressive: true
                                             }),
                           imagemin.optipng({
                                                optimizationLevel: 5
                                            }),
                           imagemin.svgo()
                       ]))
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
if (config.using.pug) {
    gulp.task("pug:compile", function () { // Returns stream for synchronous execution
        return gulp.src([paths.src.pug + "/**/*.pug", "!" + paths.src.pug + "/**/_*.pug"])
                   .pipe(pug({pretty: '    '}))
                   .pipe(gulp.dest(paths.src.html));
    });
}
gulp.task("html:minify", (config.using.pug) ? ["pug:compile"] : [], function () {
    gulp.src(paths.src.html + "/**/*.html")
        .pipe(htmlmin({
                          html5                     : true,
                          collapseWhitespace        : true,
                          removeComments            : true,
                          minifyCSS                 : true,
                          minifyJS                  : {mangle: false},
                          processConditionalComments: true,
                          quoteCharacter            : "\"",
                          removeEmptyAttributes     : true,
                          removeRedundantAttributes : true,
                          collapseBooleanAttributes : true
                      }))
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
gulp.task("clean", ["dependencies:clean"], function () {
    del.sync(clean);
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
    if (config.using.pug) {
        gulp.watch(paths.src.pug + "/**/*.pug", ["pug"]);
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
if (config.using.pug) {
    gulp.task("pug", ["pug:compile"]);
}
gulp.task("html", ["html:minify"]);
var build = [];
if (config.using.scss) {
    build.push("scss");
}
build.push("css", "img", "js");
if (config.using.pug) {
    build.push("pug");
}
build.push("html");
gulp.task("build", build);
gulp.task("default", ["build", "watch", "browserSync:serve"]);