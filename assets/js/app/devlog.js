angular.module('devlog', [

  // Vendor libs
  'ngSanitize',
  'ngResource',
  'ngStorage',
  'ui.router',
  'ui.bootstrap',

  // App templates
  'devlog.templates',

  // App modules
  'devlog.main',
  'devlog.dashboard',
  'devlog.profile'

])

.config(function($urlRouterProvider) {
  $urlRouterProvider
      .when('', '/devlog')
      .when('/', '/devlog')
      .otherwise('/devlog');
})

.run(function($state, $stateParams, $rootScope) {
  // Make state and stateParams available in templates
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;

  // Log state change errors
  // Resolve errors are logged also
  // https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#issue-im-getting-a-blank-screen-and-there-are-no-errors
  $rootScope.$on('$stateChangeError', console.log.bind(console));

});
