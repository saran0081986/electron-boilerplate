module.exports = function (grunt) {

	require("load-grunt-tasks")(grunt);

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
			imageExtensions: "{png,jpg,gif,svg}"
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
				mangle: false,
				screwIE8: true
			},
			minimize: {
				expand: true,
				cwd: "<%= paths.src.js %>/js",
				src: ["**/*.js", "!<%= paths.aloneDirName %>/**/*.js"],
				dest: "<%= paths.src.js %>/<%= paths.minimizedDirName %>"
			},
			minimizeAlone: {
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
		trigger_lr: {
			css: {
				options: {
					paths: ["<%= paths.src.css %>/**/*.css"]
				}
			}
		},
		watch: {
			js: {
				files: ["<%= paths.src.js %>/js/**/*.js"],
				tasks: ["js"],
				options: {spawn: false, livereload: true}
			},
			scss: {
				files: ["<%= paths.src.css %>/scss/**/*.scss"],
				tasks: ["scss", "css", "trigger_lr:css"],
				options: {spawn: false}
			},
			css: {
				files: ["<%= paths.src.css %>/css/**/*.css"],
				tasks: ["css"],
				options: {spawn: false, livereload: true}
			},
			img: {
				files: ["<%= paths.src.img %>/img/**/*.<%= paths.imageExtensions %>"],
				tasks: ["img"],
				options: {spawn: false}
			},
			html: {
				files: ["**/*.html"],
				tasks: [],
				options: {spawn: false, livereload: true}
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
		}
	});

	grunt.registerTask("default", ["js", "scss", "css", "watch"]);
	grunt.registerTask("js", ["newer:uglify:minimize", "newer:uglify:minimizeAlone", "newer:concat:combineJs", "newer:copy:copyJs"]);
	grunt.registerTask("scss", ["newer:sass"]);
	grunt.registerTask("css", ["newer:cssmin:minimize", "newer:cssmin:minimizeAlone", "newer:concat:combineCss", "newer:copy:copyCss"]);
	grunt.registerTask("img", ["newer:imagemin", "newer:copy:copyImg"]);
	grunt.registerTask("cleanup", ["clean:dependencies", "clean:js", "clean:css", "clean:img", "clean:dist", "cleanempty"]);
	grunt.registerTask("build", ["js", "scss", "css", "img"]);
	grunt.registerTask("init", ["copy:init"]); //"curl:init"
};