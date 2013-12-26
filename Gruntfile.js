module.exports = function(grunt) {

  // Configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: '/*!\n' +
          ' * <%= pkg.title %> - v<%= pkg.version %>\n' +
          ' * Copyright <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>\n' +
          '<%= pkg.homepage ? " * " + pkg.homepage + "\\n" : "" %>' +
          ' * Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>.\n' +
          ' *\n' +
          ' * Based upon the plugin by Tzury Bar Yochay and extended by John Resig:\n' +
          ' * https://github.com/tzuryby/hotkeys\n' +
          ' * https://github.com/jeresig/jquery.hotkeys\n' +
          ' *\n' +
          ' * Original idea by:\n' +
          ' * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/\n' +
          '*/\n',
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['src/*.js']
    },
    clean: {
      dist: ['dist/*']
    },
    concat: {
      dist: {
        options: {
          banner: '<%= meta %>'
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: 'dist/',
          ext: '.hotkeys.js'
        }]
      }
    },
    uglify: {
      dist: {
        options: {
          banner: '<%= meta %>',
          compress: true,
          mangle: true,
          preserveComments: false
        },
        files: [{
          expand: true,
          flatten: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: 'dist/',
          ext: '.hotkeys.min.js'
        }]
      }
    }
  });

  // Task loading.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Task registration.
  grunt.registerTask('default', ['jshint', 'clean', 'concat', 'uglify']);

};
