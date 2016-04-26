module.exports = function(grunt) {

    var path = require('path');
    var appConfig = grunt.file.readJSON('package.json');
    // Load grunt tasks automatically
    // see: https://github.com/sindresorhus/load-grunt-tasks
    require('load-grunt-tasks')(grunt);
    
    var pathsConfig = function (appName) {

        return {
            absolute: path.resolve(),
            source: './src',
            build: './build',
            js: '/js',
            css: '/css',
            images: '/img',
            icons: '/icons',
            fonts: '/fonts',
            templates: '/templates'
        };
    };

    grunt.initConfig({

        paths: pathsConfig(),
        pkg: appConfig,

        // -- Clean Config ---------------------------------------------------------

        clean: {
            default: [
                '<%= paths.build %>'
            ],
            development: [
                '<%= paths.build %>/index.html',
                '<%= paths.build %>/app.css',
                '<%= paths.build %>/app.js',
                '<%= paths.build %><%= paths.templates %>'
            ]
        },

        // -- Concat Config --------------------------------------------------------
        concat: {
            options: {
                stripBanners: true
            },
            js: {
                options: {
                    stripBanners: false,
                    separator: ';',
                    banner: ';(function(angular, undefined) {\n\'use strict\'\n',
                    footer: '\n})(window.angular);'
                },
                files: [{
                    '<%= paths.build %>/app.js': [
                        '<%= paths.source %><%= paths.js %>/app.js',
                        '<%= paths.source %><%= paths.js %>/**/*.js'
                    ]
                }]
            },
            css: {
                options: {
                    stripBanners: true
                },
                files: [{
                    '<%= paths.build %>/app.css': [
                        '<%= paths.source %><%= paths.css %>/**/*.css'
                    ]
                }]
            },
            deps: {
                options: {
                    stripBanners: true
                },
                files: [{
                    '<%= paths.build %>/lib.js': [
                        './bower_components/angular/angular.js',
                        './bower_components/angular-cookies/angular-cookies.js',
                        './bower_components/angular-resource/angular-resource.js',
                        './bower_components/angular-route/angular-route.js',
                        './bower_components/ng-sortable/dist/ng-sortable.js',
                        './bower_components/UI/build/ui.js',
                        './bower_components/tinycolor/tinycolor.js'
                    ]
                }, {
                    '<%= paths.build %>/lib.css': [
                        './bower_components/angular/angular-csp.css',
                        './bower_components/pure/build/pure.css',
                        './bower_components/pure/build/grids-responsive.css',
                        './bower_components/pure/build/pure-theme.css',
                        './bower_components/ng-sortable/dist/ng-sortable.css',
                        './bower_components/UI/build/ui.css'
                    ]
                }]
            }
        },
        
        // see: https://github.com/FWeinb/grunt-svgstore
        svgstore: {
            default : {
                options: {
                    inheritviewbox: true,
                    convertNameToId: function(name) {
                        return "icon--" + name;
                    },
                    includeTitleElement: false,
                    svg: {
                        xmlns: 'http://www.w3.org/2000/svg',
                        style: 'width:0;height:0'
                    },
                    cleanup: true,
                    includedemo : true
                },  
                files: {
                    '<%= paths.build %><%= paths.icons %>/icons.svg': [
                        '<%= paths.source %>/**/*.svg'
                    ],
                },
            }
        },
        
        // -- Angular Annotate Config --------------------------------------------------------
        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            files: {
                expand: true,
                src   : [
                    '<%= paths.build %>/lib.js',
                    '<%= paths.build %>/app.js'
                ]
            }
        },
                
        // -- Copy Static Files ----------------------------------------------------------
        copy: {
            fonts: {
                expand: true,
                cwd: '<%= paths.source %><%= paths.fonts %>/',
                src: '**',
                dest: '<%= paths.build %><%= paths.fonts %>/'
            },
            images: {
                expand: true,
                cwd: '<%= paths.source %><%= paths.images %>/',
                src: '**',
                dest: '<%= paths.build %><%= paths.images %>/'
            }
        },

        // -- CSSMin Config --------------------------------------------------------

        cssmin: {
            options: {
                noAdvanced: true
            },

            files: {
                expand: true,
                src: '<%= paths.build %>/*.css',
                ext: '-min.css'
            }
        },

        // -- HTMLMin Config --------------------------------------------------------        
        htmlmin: {
            default: {
                options: {
                    caseSensitive: true,
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.source %>/',
                    src: 'index.html',
                    dest: '<%= paths.build %>/'
                    
                },{
                    expand: true,
                    cwd: '<%= paths.source %><%= paths.templates %>/',
                    src: '*.html',
                    dest: '<%= paths.build %><%= paths.templates %>/'
                }]
            }
        },
	
	// -- Uglify Config --------------------------------------------------------
	uglify: {
	    options: {
		sourceMap: true,
		//banner: '/*! <%= appConfig.name %> <%= appConfig.version %> | <%= appConfig.author %> | <%= appConfig.license %> Licensed */'
	    },
	    files: {
		expand: true,
                src: '<%= paths.build %>/*.js',
                ext: '-min.js'
	    }
	},
        
        // see: https://npmjs.org/package/grunt-bg-shell
        bgShell: {
            install: {
                cmd: 'bower install;cd ./bower_components/pure/;npm install;bower install;grunt build;cd ../UI/;npm install;grunt',
                stdout: true,
                stderr: true,
                bg: false
            },
            build: {
                cmd: 'cd ./bower_components/pure/;grunt build --theme=<%= paths.absolute %>/theme.json;cd ../UI/;grunt --theme=<%= paths.absolute %>//theme.json',
                stdout: true,
                stderr: true,
                bg: false
            }
        },

        // -- Watch JS SRC for changes ---------------------------------------------------------
        watch: {
            files: [
                '<%= paths.source %>/js/*.js',
                '<%= paths.source %>/css/*.css'
            ],
            tasks: ['default'],
            options: {
                interrupt: true,
                spawn: false,
            }
        }

    });

    grunt.registerTask('watch', [
        'watch'
    ]);
    
    grunt.registerTask('install', [
        'bgShell:install'
    ]);
    
    grunt.registerTask('rebuild', [
        'bgShell:build',
	'clean:development',
        'concat:js',
        'concat:css',
        'concat:deps',
        'htmlmin'
    ]);
    
    grunt.registerTask('build', [
	'clean',
        'rebuild',
        'ngAnnotate',
	'uglify',
	'cssmin',
	'svgstore',
        'copy:fonts',
        'copy:images',
    ]);

    grunt.registerTask('default', [
        'install',
	'build'
    ]);
};
