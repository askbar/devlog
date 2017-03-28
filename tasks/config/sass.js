module.exports = function(grunt) {

  grunt.config.set('sass', {
      options: {
        sourceMap: true
      },
      dev: {
        files: {
          '.tmp/public/styles/importer.css': 'assets/styles/importer.scss'
        }
      },
      prod: {

      }
  });
};