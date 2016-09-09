module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      // for localhost: sourcemaps +etc
      develop: {
        options: {
          preserveComments: 'all',
          sourceMap: true,
          sourceMapIncludeSources: true,
          banner: '/* <%= pkg.name %> (develop) <%= grunt.template.today("dd-mm-yyyy") %> */\n'
        },
        files: {
          './public/js/stb-all.min.js':
            [
              './src/js/modernizr.custom.js',
              './node_modules/jquery/dist/jquery.js',
              './node_modules/jquery-match-height/dist/jquery.matchHeight.js',
              './node_modules/jquery.hotkeys/jquery.hotkeys.js',
              './src/js/jquery-ui-1.11.0.js',
              './src/js/jquery.tablesorter.js',

              // bootstrap code, all plugins
              './node_modules/bootstrap/dist/js/bootstrap.js',

              './src/js/typeahead.bundle.min.js',
              './src/js/stb-search.js',
              './src/js/stb-common.js',
              './src/js/stb-page-padding.js',
              './src/js/stb-video.js',
              './src/js/bootstrapValidator-0.5.3.js',

              // './node_modules/moment/moment.js',

              // spin.js+jq-plugin + custom presets
              './node_modules/spin.js/spin.js',
              './node_modules/spin.js/jquery.spin.js',
              './src/js/stb-spinjs-presets.js',

              './src/js/stb-toc-list.js',
              './src/js/stb-analyze-ga.js',

              // Enonic-specific (todo: add new js-bundle task for this)
              './src/js/enonic/stb-search.js'
            ]
        }
      },
      // for prod: no sourcemaps etc
      prod: {
        options: {
          sourceMap: false,
          banner: '/* <%= pkg.name %> (dist) <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        },
        files: '<%= uglify.develop.files %>'
      }
    },

    less: {
      // develop should have sourcemaps
      develop: {
        options: {
          sourceMap: true,
          sourceMapFileInline: true,
          outputSourceFiles: true,
          ieCompat: true
        },
        files: {
          // target.css <- source.less
          "./public/css/stb-all.min.css": "./src/less/stb-main.less",
          "./public/css/stb-all-webmanual.min.css": "./src/less/stb-main-webmanual.less"
        }
      },
      // prod: minified versions
      prod: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2,
          ieCompat: true
        },
        files: '<%= less.develop.files %>'
      },
    },

    copy: {
      html: {
        src: './*.html',
        dest: './public/'
      },
      images: {
        expand: true,
        src: './images/**',
        dest: './public/'
      },
      fonts: {
        expand: true,
        src: './fonts/**',
        dest: './public/'
      },
      data: {
        expand: true,
        src: './data/**',
        dest: './public/'
      }
    },

    watch: {
      styles: {
        files: ['./src/less/**'],
        tasks: ['less:develop'],
        options: {
          nospawn: true,
          livereload: true
        }
      },
      markup: {
        files: ['./*.html'],
        tasks: ['copy:html'],
        options: {
          livereload: true
        }
      },
      images: {
        files: ['./images/*'],
        tasks: ['copy:images'],
        options: {
          livereload: true
        }
      },
      fonts: {
        files: ['./fonts/*'],
        tasks: ['copy:fonts'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: ['src/js/**'],
        tasks: ['uglify:develop'],
        options: {
          nospawn: true,
          livereload: true
        }
      }
    },

    // serve http from localhost:
    connect: {
      server: {
        options: {
          port: 8000,
          base: './public/',
          livereload: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task
  grunt.registerTask('default', ['usage']);

  grunt.registerTask('usage', 'Output usage information', function(){
    grunt.log.error('Error: no grunt task specified, tasks available are:\n');
    grunt.log.subhead('> grunt serve');
    grunt.log.ok('  used locally, will expose webserver on port 8000 and listen for changes to files\n');
    grunt.log.subhead('> grunt dist');
    grunt.log.ok('  used to build your minified version, all files are put in ./public/\n');
  });
  // "grunt serve" is used for local development
  grunt.registerTask('serve',   ['copy', 'uglify:develop', 'less:develop', 'connect', 'watch']);
  // run "gulp dist" for minified/compressed output
  grunt.registerTask('dist',    ['copy', 'less:prod', 'uglify:prod']);
};