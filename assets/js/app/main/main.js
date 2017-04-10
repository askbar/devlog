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
          templateUrl: 'assets/js/app/main/main',
          controller: 'MainController'
        },
        'header@devlog': {
          templateUrl: 'assets/js/app/main/header',
          controller: 'HeaderController'
        }
      }
    });

    // Route fallbacks
    $urlRouterProvider
        .when('/devlog', '/devlog/dashboard');
})


.run(function($templateCache) {

});
