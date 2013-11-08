'use strict';
module.exports = function (grunt) {
    var _, hbs, sass, component, dist,test;

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    _ = require('lodash');
    hbs = require('component-builder-handlebars');
    sass = require('component-sass');

    component = {
        options: {
            verbose: false,
            dev: true,
            noRequire: false,
            name: 'build',
            standalone: true,
            sourceUrls: true,
            configure: function(builder) {
                builder.use(hbs({
                    extname: '.hbs',
                    partialRegex: /^_/
                }));

                builder.use(sass);
            }
        },
        src: '.',
        dest: './build'
    };
    dist = _.extend(_.clone(component), {
        options: {
            verbose: true,
            dev: false,
            noRequire: true,
            name: 'dist',
            standalone: true,
            configure: function(builder) {
                builder.use(hbs({
                    extname: '.hbs',
                    partialRegex: /^_/
                }));

                builder.use(sass);
            }
        }
    });
    test =_.cloneDeep(component);
    test.options.name = 'test';
    test.options.sourceUrls = true;
    test.options.standalone = false;
    dist = _.extend(_.clone(component), {
         verbose: true,
	 noRequire: true,
	 dev: false,
 	 standalone: true
    });

    grunt.initConfig({
        clean: ['./build', './components'],
        shell: {
            dev: {
                options: {
                    stdout: true
                },
                command: './node_modules/component/bin/component install -d'
            },
            dist: {
                options: {
                    stdout: false
                },
                command: './node_modules/component/bin/component install'
            }
        },
        componentbuild: {
            build: component,
	    test: test,
            dist: dist
        },
        watch: {
            scripts: {
                files: [
                    '**/*.js',
                    '**/*.hbs',
                    '**/*.sass',
                    '**/*.scss',
                    '!build/build.js',
                    '!GruntFile.js'
                ],
                tasks: [ 'componentbuild:build', 'componentbuild:test' ]
            } 
        }
    });

    grunt.registerTask('default', [
        'shell:dev',
        'componentbuild:build',
	'componentbuild:test'
    ]);

    // TODO:switch to dist task for templates if any
    grunt.registerTask('dist', [
        'clean',
        'shell:dist',
        'componentbuild:dist'
    ]);
};

