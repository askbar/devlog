angular.module('devlog.logger', [
  'devlog.logger.controllers',
  'devlog.logger.services'
])

  .config(function ($stateProvider) {

    $stateProvider
      .state('logger', {
        url: '/logger?ids',
        parent: 'devlog',
        params: {
          ids: {
            value: [],
            array: true,
            squash: true
          }
        },
        resolve: {},
        views: {
          'content@devlog': {
            templateUrl: 'assets/js/app/logger/templates/logger',
            controller: 'LoggerController'
          }
        }
      });
  })

  .run(function () {

  });