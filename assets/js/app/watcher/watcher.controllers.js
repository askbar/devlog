angular.module('devlog.watcher.controllers', [])

.controller('WatcherController',
    ['$scope', '_profiles', 'Watcher',
    function($scope, _profiles, Watcher) {

    	$scope.profiles = _profiles;

        $scope.watchers = [];
        $scope.loadWatchers = function () {
            $scope.watchers = Watcher.query();
        };

        $scope.loadWatchers();

        $scope.edit = function (watcher) {
            $state.go('.edit', {
                id: watcher.id
            });
        };

        $scope.delete = function (watcher) {
            watcher.$delete({
                id: watcher.id
            }).then(function (response) {
                _.pull($scope.watchers, watcher);
            }, function (response) {
                console.log('error', response);
            });
        };

    }])

    .controller('WatcherCreateController',
    ['$scope', 'lodash', 'Watcher', '$uibModalInstance', '_profiles',
        function ($scope, _, Watcher, $uibModalInstance, _profiles) {

        	$scope.profiles = _profiles;

            $scope.formModel = {
                id: '',
                automatic: false,
                profiles: ['']
            };

            // Add another empty file path to the paths array
            $scope.addProfile = function () {
                $scope.formModel.profiles.push('');
            };

            $scope.create = function () {
                var watcher = new Watcher($scope.formModel);
                watcher.$save().then(function (watcher) {
                    $uibModalInstance.close({
                        watcher: watcher
                    });
                }, function (response) {
                    console.log('error', response);
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

            $scope.$on('$destroy', function() {
            	$scope.profiles = null;
            	$scope.formModel = null;
            });

        }]);