angular.module('devlog.watcher.controllers', [])

.controller('WatcherController',
    ['$scope', '_profiles', '_watchers', '$state', 'lodash',
    function($scope, _profiles, _watchers, $state, _) {

    	$scope.profiles = _profiles;
        $scope.watchers = _watchers;

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

        $scope.log = function(watcher) {
        	$state.go('logger', {
        		ids: [watcher.id]
        	});
        };

        $scope.$on('$destroy', function() {
        	$scope.profiles = null;
        	$scope.watchers = null;
        });

    }])

    .controller('WatcherCreateController',
    ['$scope', 'lodash', 'Watcher', '$uibModalInstance', '_profiles',
        function ($scope, _, Watcher, $uibModalInstance, _profiles) {

        	$scope.profiles = _profiles;
            $scope.lineOptions = [{
                key: 'ALL',
                value: -1
            }, {
                key: '100',
                value: 100
            }, {
                key: '250',
                value: 250
            }, {
                key: '500',
                value: 500
            }, {
                key: '1000',
                value: 1000
            }];

            $scope.formModel = {
                name: '',
                lines: 100,
                profiles: ['']
            };

            // Add another empty file path to the paths array
            $scope.addProfile = function () {
                $scope.formModel.profiles.push('');
            };

            $scope.removeProfile = function(index) {
                _.remove($scope.formModel.profiles, function (v, k) {
                    return _.eq(k, index);
                });
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

        }])

.controller('WatcherEditController',
    ['$scope', 'lodash', 'Watcher', '$uibModalInstance', '_profiles', '_watcher',
        function ($scope, _, Watcher, $uibModalInstance, _profiles, _watcher) {

            $scope.lineOptions = [{
                key: 'ALL',
                value: -1
            }, {
                key: '100',
                value: 100
            }, {
                key: '250',
                value: 250
            }, {
                key: '500',
                value: 500
            }, {
                key: '1000',
                value: 1000
            }];

        	$scope.profiles = _profiles;
            $scope.formModel = _watcher;

            $scope.addProfile = function () {
                $scope.formModel.profiles.push('');
            };

            $scope.removeProfile = function(index) {
                _.remove($scope.formModel.profiles, function (v, k) {
                    return _.eq(k, index);
                });
            };

            $scope.edit = function() {
                Watcher.update({
                    id: $scope.formModel.id
                }, $scope.formModel).$promise.then(function(response) {
                    $uibModalInstance.close({
                        watcher: response
                    });
                }, function(response) {
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