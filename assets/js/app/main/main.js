angular.module('devlog.main', [
  'devlog.main.controllers',
  'devlog.main.directives',
  'devlog.main.services'
])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('devlog', {
      url: '/devlog',
      abstract: true,
      views: {
        '': {
          templateUrl: 'assets/js/app/main/templates/main',
          controller: 'MainController'
        },
        'header@devlog': {
          templateUrl: 'assets/js/app/main/templates/header',
          controller: 'HeaderController'
        }
      }
    });

    // Route fallbacks
    $urlRouterProvider
        .when('/devlog', '/devlog/watcher');
})


.run(function($templateCache) {

});
