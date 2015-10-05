module.exports = function (grunt) {

	require("load-grunt-tasks")(grunt);
	var fs = require("fs");

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		paths: {
			srcDir: "./src",
			src: {
				js: "<%= paths.srcDir %>/js",
				css: "<%= paths.srcDir %>/css",
				img: "<%= paths.srcDir %>/img"
			},
			distDir: "./dist",
			dist: {
				js: "<%= paths.distDir %>/assets/js",
				css: "<%= paths.distDir %>/assets/css",
				img: "<%= paths.distDir %>/assets/img"
			},
			aloneDirName: "alone",
			minimizedDirName: "min",
			concatenatedFileName: "min",
			imageExtensions: "{png,jpg,gif,svg}",
			uglifyMangleExceptionFile: "<%= paths.src.js %>/mangle-exceptions.json"
		},
		copy: {
			init: {
				files: [
					{
						expand: true,
						cwd: "./node_modules/bourbon/app/assets/stylesheets",
						src: ["**/*"],
						dest: "<%= paths.src.css %>/scss/mixins/bourbon"
					},
					{
						expand: true,
						cwd: "./node_modules/bourbon-neat/app/assets/stylesheets",
						src: ["**/*"],
						dest: "<%= paths.src.css %>/scss/mixins/neat"
					},
					{
						src: "./node_modules/jquery/dist/jquery.min.js",
						dest: "<%= paths.dist.js %>/jquery.js"
					},
					{
						src: "./node_modules/normalize.css/normalize.css",
						dest: "<%= paths.src.css %>/css/normalize.css"
					}
				]
			}
		},
		curl: { // If empty disabled at Gruntfile's end
			init: {
				files: []
			}
		}
	});

	var dependencies = [];
	grunt.config.get("copy.init.files").forEach(function (file) {
		dependencies.push(file.dest);
	});
	grunt.config.get("curl.init.files").forEach(function (file) {
		dependencies.push(file.dest);
	});

	grunt.config.merge({
		uglify: {
			options: {
				mangle: {
					except: grunt.file.readJSON(grunt.config.get("paths.uglifyMangleExceptionFile"), {encoding: "utf8"})
				},
				screwIE8: true
			},
			compute: {
				expand: true,
				cwd: "<%= paths.src.js %>/js",
				src: ["**/*.js", "!<%= paths.aloneDirName %>/**/*.js"],
				dest: "<%= paths.src.js %>/<%= paths.minimizedDirName %>"
			},
			computeAlone: {
				expand: true,
				cwd: "<%= paths.src.js %>/js/<%= paths.aloneDirName %>/",
				src: ["**/*.js"],
				dest: "<%= paths.src.js %>/<%= paths.minimizedDirName %>/<%= paths.aloneDirName %>"
			}
		},
		sass: {
			files: {
				expand: true,
				cwd: "<%= paths.src.css %>/scss",
				src: ["**/*.scss"],
				dest: "<%= paths.src.css %>/css",
				ext: ".css",
				extDot: "last"
			}
		},
		cssmin: {
			minimize: {
				expand: true,
				cwd: "<%= paths.src.css %>/css",
				src: ["**/*.css", "!<%= paths.aloneDirName %>/**/*.css"],
				dest: "<%= paths.src.css %>/<%= paths.minimizedDirName %>"
			},
			minimizeAlone: {
				expand: true,
				cwd: "<%= paths.src.css %>/css/<%= paths.aloneDirName %>/",
				src: ["**/*.css"],
				dest: "<%= paths.src.css %>/<%= paths.minimizedDirName %>/<%= paths.aloneDirName %>"
			},
			combineCss: {
				files: {
					"<%= paths.src.css %>/<%= paths.minimizedDirName %>/<%= paths.concatenatedFileName %>.css": [
						"<%= paths.src.css %>/<%= paths.minimizedDirName %>/**/*.css",
						"!<%= paths.src.css %>/<%= paths.minimizedDirName %>/<%= paths.aloneDirName %>/**/*.css"
					]
				}
			}
		},
		imagemin: {
			files: {
				expand: true,
				cwd: "<%= paths.src.img %>/img",
				src: ["**/*.<%= paths.imageExtensions %>"],
				dest: "<%= paths.src.img %>/<%= paths.minimizedDirName %>"
			}
		},
		concat: {
			combineJs: {
				"<%= paths.src.js %>/<%= paths.minimizedDirName %>/<%= paths.concatenatedFileName %>.js": [
					"<%= paths.src.js %>/<%= paths.minimizedDirName %>/**/*.js",
					"!<%= paths.src.js %>/<%= paths.minimizedDirName %>/<%= paths.aloneDirName %>/**/*.js"
				]
			}
		},
		copy: {
			copyJs: {
				files: [
					{
						expand: true,
						cwd: "<%= paths.src.js %>/<%= paths.minimizedDirName %>/",
						src: ["<%= paths.concatenatedFileName %>.js"],
						dest: "<%= paths.dist.js %>"
					},
					{
						expand: true,
						cwd: "<%= paths.src.js %>/<%= paths.minimizedDirName %>/<%= paths.aloneDirName %>/",
						src: ["**/*.js"],
						dest: "<%= paths.dist.js %>"
					}
				]
			},
			copyCss: {
				files: [
					{
						expand: true,
						cwd: "<%= paths.src.css %>/<%= paths.minimizedDirName %>/",
						src: ["<%= paths.concatenatedFileName %>.css"],
						dest: "<%= paths.dist.css %>"
					},
					{
						expand: true,
						cwd: "<%= paths.src.css %>/<%= paths.minimizedDirName %>/<%= paths.aloneDirName %>/",
						src: ["**/*.css"],
						dest: "<%= paths.dist.css %>"
					}
				]
			},
			copyImg: {
				expand: true,
				cwd: "<%= paths.src.img %>/<%= paths.minimizedDirName %>/",
				src: ["**/*.<%= paths.imageExtensions %>"],
				dest: "<%= paths.dist.img %>"
			}
		},
		watch: {
			uglifyMangleExceptionFiles: {
				files: [grunt.config.get("paths.uglifyMangleExceptionFile")],
				tasks: ["uglify:compute", "uglify:computeAlone"],
				options: {spawn: false, reload: true}
			},
			js: {
				files: ["<%= paths.src.js %>/js/**/*.js"],
				tasks: ["js"],
				options: {spawn: false}
			},
			scss: {
				files: ["<%= paths.src.css %>/scss/**/*.scss"],
				tasks: ["scss", "css"],
				options: {spawn: false}
			},
			css: {
				files: ["<%= paths.src.css %>/css/**/*.css"],
				tasks: ["css"],
				options: {spawn: false}
			},
			img: {
				files: ["<%= paths.src.img %>/img/**/*.<%= paths.imageExtensions %>"],
				tasks: ["img"],
				options: {spawn: false}
			},
			html: {
				files: ["**/*.html"],
				tasks: [],
				options: {spawn: false}
			}
		},
		clean: {
			js: [
				"<%= paths.src.js %>/<%= paths.minimizedDirName %>/**/*.js"
			],
			css: [
				"<%= paths.src.css %>/<%= paths.minimizedDirName %>/**/*.css"
			],
			img: [
				"<%= paths.src.img %>/<%= paths.minimizedDirName %>/**/*.<%= paths.imageExtensions %>"
			],
			dist: [
				"<%= paths.dist.js %>/**/*.js",
				"<%= paths.dist.css %>/**/*.css",
				"<%= paths.dist.img%>/**/*.<%= paths.imageExtensions %>"
			],
			dependencies: dependencies
		},
		cleanempty: {
			options: {
				files: false
			},
			src: [
				"<%= paths.distDir %>/**",
				"<%= paths.srcDir %>/**"
			]
		},
		browserSync: {
			server: {
				bsFiles: {
					src: [
						'<%= paths.dist.css %>/**/*.css',
						'<%= paths.distDir %>/**/*.html'
					]
				},
				options: {
					watchTask: true,
					server: "<%= paths.distDir %>"
				}
			}
		}
	});

	grunt.registerTask("default", ["browserSync:server", "js", "scss", "css", "watch"]);
	grunt.registerTask("js", ["uglify:compute", "uglify:computeAlone", "concat:combineJs", "copy:copyJs"]);
	grunt.registerTask("scss", ["sass"]);
	grunt.registerTask("css", ["cssmin:minimize", "cssmin:minimizeAlone", "cssmin:combineCss", "copy:copyCss"]);
	grunt.registerTask("img", ["newer:imagemin", "copy:copyImg"]);
	grunt.registerTask("cleanup", ["clean:dependencies", "clean:js", "clean:css", "clean:img", "clean:dist", "cleanempty"]);
	grunt.registerTask("build", ["js", "scss", "css", "img"]);
	grunt.registerTask("init", ["copy:init"]); //"curl:init"
};