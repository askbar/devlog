angular.module('devlog.profile', [
  'angularFileUpload',
  'devlog.profile.controllers',
  'devlog.profile.services'
])

  .config(function ($stateProvider) {

    $stateProvider
      .state('profile', {
        url: '/profile',
        parent: 'devlog',
        params: {
          profile: {
            value: null
          }
        },
        resolve: {
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
        onEnter: ['$uibModal', '$state', function ($uibModal, $state) {
          $uibModal.open({
            templateUrl: 'assets/js/app/profile/templates/modals/create',
            controller: 'ProfileCreateController'
          }).result.then(function (result) {
            $state.go('^', {
              profile: result.profile
            });
          }, function () {
            $state.go('^');
          });
        }],
      })

      .state('profile.edit', {
        url: '/edit/:id',
        params: {
          id: {
            value: null
          }
        },
        onEnter: ['$uibModal', '$state', '$stateParams', function ($uibModal, $state, $stateParams) {
          var profileId = $stateParams.id;
          $uibModal.open({
            templateUrl: 'assets/js/app/profile/templates/modals/edit',
            controller: 'ProfileEditController',
            resolve: {
              _profile: ['Profile', function (Profile) {
                return Profile.get({
                  id: profileId
                }).$promise;
              }]
            }
          }).result.then(function (result) {
            $state.go('^', {
              profile: result.profile
            });
          }, function () {
            $state.go('^');
          });
        }]
      });

  })

  .run(function () {

  });