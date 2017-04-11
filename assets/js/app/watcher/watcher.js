angular.module('devlog.watcher', [
  'devlog.watcher.controllers',
  'devlog.watcher.services'
])

.config(function($stateProvider) {

    $stateProvider
      .state('watcher', {
        url: '/watcher',
        parent: 'devlog',
        reloadOnSearch: false,
        params: {},
        resolve: {
          _profiles: ['Profile', function(Profile) {
            return Profile.query();
          }]
        },
        views: {
          'content@devlog': {
            templateUrl: 'assets/js/app/watcher/templates/watcher',
            controller: 'WatcherController'
          }
        }
      })

      .state('watcher.create', {
        url: '/create',
        params: {},
        onEnter: ['$uibModal', '$state', 'Profile',
        function($uibModal, $state, Profile) {
          $uibModal.open({
            templateUrl: 'assets/js/app/watcher/templates/modals/create',
            controller: 'WatcherCreateController',
            resolve: {
              _profiles: function() {
                return Profile.query();
              }
            }
          }).result.then(function(result) {
            $state.go('^', result);
          }, function() {
            $state.go('^');
          });
        }]
      });

})

.run(function() {

});