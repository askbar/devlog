// Annotate (strict-di) and concatenate all angular
// files into a single file.

module.exports = function(grunt) {

  grunt.config.set('jshint', {
    options: {
    },
    dev: {
      files: {
        src: ['assets/js/app/**/**.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
};