angular.module('devlog.profile.controllers', [])

.controller('ProfileController',
    ['$scope', 'Profile',
    function($scope, Profile) {
        
        $scope.profiles = [];
        $scope.loadProfiles = function() {
            $scope.profiles = Profile.query();
        };

        $scope.loadProfiles();

    }])

.controller('ProfileCreateController',
	['$scope', 'lodash', 'Profile', '$uibModalInstance', 
    function($scope, _, Profile, $uibModalInstance) {

        $scope.formModel = {
            id: '',
            name: '',
            paths: ['']
        };
        
        // Add another empty file path to the paths array
        $scope.addPath = function() {
            $scope.formModel.paths.push('');
        };

        $scope.create = function() {
            var profile = new Profile($scope.formModel);
            profile.$save().then(function(profile) {
                console.log('profile created', profile);
                $uibModalInstance.close();
            }, function(response) {
                console.log('error', response);
            });
        };
        
        $scope.cancel = function() {
            $uibModalInstance.close();
        };

	}]);