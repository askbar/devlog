angular.module('devlog.profile.controllers', [])

    .controller('ProfileController',
    ['$scope', 'Profile', 'lodash', '$window', '$state',
        function ($scope, Profile, _, $window, $state) {

            $scope.profiles = [];
            $scope.loadProfiles = function () {
                $scope.profiles = Profile.query();
            };

            $scope.loadProfiles();

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
                id: '',
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
                    $uibModalInstance.close({
                        profile: profile
                    });
                }, function (response) {
                    console.log('error', response);
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

        }])

    .controller('ProfileEditController',
    ['$uibModalInstance', '$scope', '$state', '$stateParams', 'Profile', '_profile', 'lodash',
        function ($uibModalInstance, $scope, $state, $stateParams, Profile, _profile, _) {

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
                Profile.update({
                    id: $scope.formModel.id
                }, $scope.formModel).$promise.then(function(response) {
                    // console.log('profile updated', response);
                    $uibModalInstance.close({
                        profile: response
                    });
                }, function(response) {
                    console.log('error', response);
                });
            };

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

        }]);