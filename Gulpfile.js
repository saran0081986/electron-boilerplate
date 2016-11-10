var gulp        = require("gulp");
var browserSync = require("browser-sync");

var concat   = require("gulp-concat");
var cssnano  = require("gulp-cssnano");
var del      = require("del");
var fs       = require("fs");
var glob     = require("glob");
var htmlmin  = require("gulp-htmlmin");
var imagemin = require("gulp-imagemin");
var path     = require("path");
var pug      = require("gulp-pug");
var postcss  = require("gulp-postcss");
var sass     = require("gulp-sass");
var uglify   = require("gulp-uglify");

var server = browserSync.create("server");

var config = {
    using          : {
        css : false,
        scss: true,
        html: false,
        pug : true
    },
    imageExtensions: "{png,jpg,gif,svg}"
};

function getBundles(dir) {
    return fs.readdirSync(dir)
             .filter(function (file) {
                 return fs.statSync(path.join(dir, file))
                          .isDirectory();
             });
}

/*
 * Dependencies
 */
var dependencies = [
    {
        cwd : "node_modules/bourbon/app/assets/stylesheets",
        src : "**/*",
        dest: "src/scss/vendors/bourbon"
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
    require("autoprefixer")({
                                browsers: ["last 2 version"]
                            })
];
if (config.using.scss) {
    gulp.task("scss:compile", function () {
        gulp.src("src/scss/bundles/**/*.scss")
            .pipe(sass({
                           indentWidth: 4,
                           outputStyle: "expanded"
                       })
                      .on("error", sass.logError))
            .pipe(gulp.dest("src/css/bundles"));
    });
}
gulp.task("css:compute", function () {
    getBundles("src/css/bundles")
        .map(function (bundle) {
            gulp.src(["src/css/bundles/" + bundle + "/**/*.css"])
                .pipe(postcss(postcssProcessors))
                .pipe(cssnano({safe: true}))
                .pipe(concat(bundle + ".bundle.css"))
                .pipe(gulp.dest("build/css"))
                .pipe(server.stream());
        });
});

/*
 * IMG
 */
gulp.task("img:compute", function () {
    gulp.src([
                 "src/img/**/*." + config.imageExtensions
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
        .pipe(gulp.dest("build/img"));
});

/*
 * JS
 */
gulp.task("js:compute", function () {
    getBundles("src/js/bundles")
        .map(function (bundle) {
            gulp.src(["src/js/bundles/" + bundle + "/**/*.js"])
                .pipe(uglify({mangle: false}))
                .pipe(concat(bundle + ".bundle.js"))
                .pipe(gulp.dest("build/js"));
        });
});

/*
 * HTML
 */
if (config.using.pug) {
    gulp.task("pug:compile", function () {
        gulp.src(["src/pug/**/*.pug", "!src/pug/**/_*.pug"])
            .pipe(pug({pretty: "    "}))
            .pipe(gulp.dest("src/html"));
    });
}
gulp.task("html:minify", function () {
    gulp.src("src/html/**/*.html")
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
        .pipe(gulp.dest("build/html"));
});

/*
 * Clean
 */
var clean = [
    "build/css/**/*.css",
    "build/img/**/*." + config.imageExtensions,
    "build/js/**/*.js",
    "build/html/**/*.html"
];
if (!config.using.css) {
    clean.push("src/css/bundles/**/*.css");
}
if (!config.using.html) {
    clean.push("src/html/**/*.html");
}
gulp.task("clean", ["dependencies:clean"], function () {
    del.sync(clean);
});

/*
 * Watch
 */
gulp.task("watch", function () {
    if (config.using.scss) {
        gulp.watch("src/scss/**/*.scss", ["scss"]);
    }
    gulp.watch("src/css/**/*.css", ["css"]);
    gulp.watch("src/img/**/*." + config.imageExtensions, ["img"]);
    gulp.watch("src/js/**/*.js", ["js"]);
    if (config.using.pug) {
        gulp.watch("src/pug/**/*.pug", ["pug"]);
    }
    gulp.watch("src/html/**/*.html", ["html"]);
});

/*
 * BrowserSync
 */
gulp.task("browserSync:server", function () {
    server.init({
                    server         : {
                        baseDir: "build"
                    },
                    open           : false,
                    reloadOnRestart: true
                });
    gulp.watch("build/html/**/*.html")
        .on("change", server.reload);
    gulp.watch("build/js/**/*.js")
        .on("change", server.reload);
});

/*
 * Tasks
 */
gulp.task("init", ["dependencies:load"]);
if (config.using.scss) {
    gulp.task("scss", ["scss:compile"]);
}
gulp.task("css", ["css:compute"]);
gulp.task("img", ["img:compute"]);
gulp.task("js", ["js:compute"]);
if (config.using.pug) {
    gulp.task("pug", ["pug:compile"]);
}
gulp.task("html", ["html:minify"]);
var buildTasks = [];
if (config.using.scss) {
    buildTasks.push("scss");
}
buildTasks.push("css", "img", "js");
if (config.using.pug) {
    buildTasks.push("pug");
}
buildTasks.push("html");
gulp.task("build", buildTasks);
gulp.task("default", ["build", "watch", "browserSync:server"]);
