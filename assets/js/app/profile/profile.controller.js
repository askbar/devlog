angular.module('devlog.profile.controllers', [])

.controller('ProfileController',
    ['$scope', '_profiles',
    function($scope, _profiles) {
    	$scope.profiles = _profiles;
    }])

.controller('ProfileCreateController',
	['$profileApi', function($profileApi) {

	}]);