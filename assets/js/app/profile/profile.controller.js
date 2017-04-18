angular.module('devlog.profile.controllers', [])

    .controller('ProfileController',
    ['$scope', '_profiles', 'lodash', '$window', '$state',
        function ($scope, _profiles, _, $window, $state) {

            $scope.profiles = _profiles;

            $scope.edit = function (profile) {
                $state.go('.edit', {
                    id: profile.id
                });
            };

            $scope.delete = function (profile) {
                profile.$delete({
                    id: profile.id
                }).then(function (response) {
                    _.pull($scope.profiles, profile);
                }, function (response) {
                    console.log('error', response);
                });
            };

        }])

    .controller('ProfileCreateController',
    ['$scope', 'lodash', 'Profile', '$uibModalInstance',
        function ($scope, _, Profile, $uibModalInstance) {

            $scope.formModel = {
                name: '',
                paths: ['']
            };

            // Add another empty file path to the paths array
            $scope.addPath = function () {
                $scope.formModel.paths.push('');
            };

            $scope.removePath = function (index) {
                _.remove($scope.formModel.paths, function (v, k) {
                    return _.eq(k, index);
                });
            };

            $scope.create = function () {
                var profile = new Profile($scope.formModel);
                profile.$save().then(function (profile) {
                    // console.log('profile created', profile);
                    $uibModalInstance.close();
                }, function (response) {
                    console.log('error', response);
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

        }])

    .controller('ProfileEditController',
    ['$uibModalInstance', '$scope', '$state', '$stateParams', '_profile', 'lodash',
        function ($uibModalInstance, $scope, $state, $stateParams, _profile, _) {

            $scope.formModel = _profile;

            // Add another empty file path to the paths array
            $scope.addPath = function () {
                $scope.formModel.paths.push('');
            };

            $scope.removePath = function (index) {
                _.remove($scope.formModel.paths, function (v, k) {
                    return _.eq(k, index);
                });
            };

            $scope.edit = function() {
                $scope.formModel.$update({
                    id: $scope.formModel.id
                }).then(function(response) {
                    $uibModalInstance.close();
                }, function(response) {
                    console.log('error', response);
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

            $scope.$on('$destroy', function() {
                $scope.formModel = null;
            });
        }]);