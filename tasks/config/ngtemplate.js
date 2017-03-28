module.exports = function(grunt) {

  grunt.config.set('ngtemplates', {
    dev: {
      src: ['assets/js/app/**/*.html'],
      dest: '.tmp/public/js/app/templates.js',
      options: {
        module: 'devlog.templates',
        standalone: true,
        append: false,
        prefix: '',
        htmlmin: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true
        },
        url: function(url) {
          return url.replace('.html', '');
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-angular-templates');
};