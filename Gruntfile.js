// Grunt tasks
module.exports = function (grunt) {
	
	'use strict';
	
	// Setup folders name, so if you wnat use a different folder structure, just update this variables
	var config = {
		dirName: 'dist',
		srcName: 'src'
	};

	// Unified Watch Object asign variables for easy editing
	var watchFiles = {
		clientJS:   [config.dirName + '/js/*.js', config.dirName + '/js/vendor/*.js'],
		clientScripts:  [config.srcName + '/scripts/*.js'],
		clientCSS:  [config.dirName + '/css/**/*.css'],
		clientPreprocessor: [config.srcName + '/sass/*.less', config.srcName + '/sass/*.scss'],
		clientHTML: ['*.html'],
		mochaTests: [config.dirName + '/test/unit/*.js'],
		concatBase: [config.srcName + '/scripts/*js', 'src/vendor/*js' ]
	};
	// Define the configuration for all the tasks
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		banner: '/*!\n' +
			'* <%= pkg.name %> - v<%= pkg.version %> - MIT LICENSE <%= grunt.template.today("yyyy-mm-dd") %>. \n' +
			'* @author <%= pkg.author %>\n' +	
			'*/\n',
		// Project settings
		
		clean: {
			build: {
    			src: [ config.dirName + '/css/*.css', config.dirName + '/js/*.js']
  			}
		},
		// Watches files for changes and runs tasks based on the changed files
		watch: {
			clientJS: {
				files: watchFiles.clientJS,
				tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			clientCSS: {
				files: watchFiles.clientCSS,
				tasks: ['csslint'],
				options: {
					livereload: true
				}
			},
			clientPreprocessor: {
				files: watchFiles.clientPreprocessor,
				tasks: ['less', 'sassCompile'],
				options: {
					livereload: true
				}
			},
			clientScripts: {
				files: watchFiles.clientScripts,
				tasks: ['concat'],
				options: {
					livereload: true
				}
			},
			clientHTML: {
				files: watchFiles.clientHTML,
				//tasks: ['csslint'],
				options: {
					livereload: true
				}
			}
		},
		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			all: {
				src: watchFiles.clientJS.concat(watchFiles.clientScripts),
				options: {
					jshintrc: '.jshintrc',
					reporter: require('jshint-stylish'),
					ignores: ['dist/js/*.min.js']
				}
			}
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			all: {
				src: watchFiles.clientCSS
			}
		},
		concat: {
			options: {
				banner: '<%= banner %>',
				stripBanners: false
			},
			base: {
				src: watchFiles.concatBase,
				dest: 'dist/js/<%= pkg.name %>-scripts.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>',
				report: 'min'
			},
			base: {
				src: ['<%= concat.base.dest %>'],
				dest: config.dirName + '/js/<%= pkg.name %>-scripts.min.js'
			}
		},
		recess: {
			options: {
				compile: true,
				banner: '<%= banner %>'
			},
			style: {
				options: {
					compress: false
				},
				src: [config.srcName + '/sass/*.less'],
				dest: config.dirName + '/css/<%= pkg.name %>-style.css'
			}
		},
		sass: {
			dist: {
				files: [{
					'dist/css/<%= pkg.name %>-style.css': config.srcName + '/sass/*.scss'
				}]
			}
		},		
		connect: {
			server: {
				options: {
					keepalive: true,
					port: 8000,
					base: '.',
					hostname: 'localhost',
					debug: true,
					livereload: true,
					open: true
				}
			}
		},
		concurrent: {
			tasks: ['connect', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		},
		bower: {
			install: {
				options: {
					layout: 'byComponent',
					install: true,
					verbose: false,
					cleanTargetDir: true,
					cleanBowerDir: false,
					bowerOptions: {
						forceLatest: true,
    					//production: true
					}
				}
			}
		},
		injector: {
			options: {
				min: false,
				addRootSlash: false,
				relative: true,
                postfix: '?v=<%= pkg.version %>',
			},
			local_dependencies: {
     			files: {
       			    'index.html': ['dist/**/*.js', 'dist/**/*.css']
     			}
   			},
            bower_dependencies: {
                options: {
                    starttag: "<!-- bower:{{ext}} -->",
                    endtag:  "<!-- endbower -->"
                },
				files: {
        			'index.html': ['bower.json']
      			}
    		}
		},
		mocha: {
			test: {
				src: ['test/**/*.html'],
				options: {
					timeout: 10000,
					page: {
						settings: {
							// disable cors checks in phantomjs
							webSecurityEnabled: false  
						}
					},
					reporter: 'Spec',
					// Indicates whether 'mocha.run()' should be executed in'bridge.js'
					run: true
				}
			}
		}
	});
	
	// Time grunt to measure the tasks time
	require('time-grunt')(grunt);

	// Load grunt tasks automatically
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project if something fail.
	grunt.option('force', true);

	// Development task(s).
	grunt.registerTask('dev', ['concurrent']);
	
	// Css task(s).
	grunt.registerTask('less', ['recess']);
	grunt.registerTask('sassCompile', ['sass']);

	// Lint task(s).
	grunt.registerTask('lint', ['jshint', 'csslint']);
	
	// Unit Testing with Karma
	grunt.registerTask('test', ['mocha']);
	
	// Build task(s).
	grunt.registerTask('build', ['lint', 'concat', 'uglify', 'test']);
};
