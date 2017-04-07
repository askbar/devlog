module.exports = function(grunt) {

  grunt.config.set('bower', {
    dev: {
      dest: '.tmp/public',
      js_dest: '.tmp/public/js/vendor',
      css_dest: '.tmp/public/styles',
      fonts_dest: '.tmp/public/fonts',
      options: {
        packageSpecific: {
            expand: true,
            'jquery': {
                keepExpandedHierarchy: false,
                files: ['dist/jquery.js']
            },
            'bootstrap-sass': {
                keepExpandedHierarchy: false,
                files: [
                    'assets/fonts/**',
                    'assets/javascripts/bootstrap.js'
                ]
            },
            'angular': {
                files: ['angular.js']
            },
            'angular-ui-router': {
                keepExpandedHierarchy: false,
                files: ['release/angular-ui-router.js']
            },
            'angular-bootstrap': {
                keepExpandedHierarchy: false,
                files: [
                    'ui-bootstrap.js',
                    'ui-bootstrap-tpls.js'
                ]
            },
            'angular-file-upload': {
              keepExpandedHierarchy: false,
              files: [
                'dist/angular-file-upload.js'
              ]
            }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};