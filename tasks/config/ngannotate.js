// Annotate (strict-di) and concatenate all angular
// files into a single file.

module.exports = function(grunt) {

  grunt.config.set('ngAnnotate', {
    options: {
      singleQuotes: true,
      sourceMap: false
    },
    dev: {
      files: {
        '.tmp/public/js/app/app.js': ['assets/js/app/**/**.js']
      }
      // files: [{
      //   expand: true,
      //   cwd: 'assets/js/app',
      //   src: ['**/*.js'],
      //   dest: '.tmp/public/js/app'
      // }]
    }
  });

  grunt.loadNpmTasks('grunt-ng-annotate');
};