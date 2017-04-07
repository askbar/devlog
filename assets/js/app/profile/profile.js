angular.module('devlog.profile', [
  'angularFileUpload',
  'devlog.profile.controllers',
  'devlog.profile.services'
])

.config(function($stateProvider) {

    $stateProvider
      .state('profile', {
        url: '/profile',
        parent: 'devlog',
        params: {},
        resolve: {
          _profiles: ['$profileApi', function($profileApi) {
            return $profileApi.query();
          }]
        },
        views: {
          'content@devlog': {
            templateUrl: 'assets/js/app/profile/templates/profile',
            controller: 'ProfileController'
          }
        }
      })

      .state('profile.create', {
        url: '/create',
        onEnter: ['$uibModal', '$state', function($uibModal, $state) {
            $uibModal.open({
              templateUrl: 'assets/js/app/profile/templates/modals/create',
              controller: 'ProfileCreateController'
            }).result.then(function() {
              $state.go('^');
            }, function() {
              $state.go('^');
            });
        }],
      });

})

.run(function() {

});