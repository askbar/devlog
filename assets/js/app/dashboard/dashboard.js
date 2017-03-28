angular.module('devlog.dashboard', [
  'devlog.dashboard.controllers',
  'devlog.dashboard.services'
])

.config(function($stateProvider) {

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        parent: 'devlog',
        reloadOnSearch: false,
        params: {},
        resolve: {},
        views: {
          'content@devlog': {
            templateUrl: 'assets/js/app/dashboard/dashboard',
            controller: 'DashboardController'
          }
        }
      });

})

.run(function() {

});