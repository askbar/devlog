angular.module('devlog.main.controllers', [])

.controller('MainController', ['$log', '$scope', '$rootScope', '$loading', 
	function($log, $scope, $rootScope, $loading) {

		var startLoadingListener = $rootScope.$on('$startLoading', function() {
			$loading.start('loading');
		});

		var stopLoadingListener = $rootScope.$on('$stopLoading', function() {
			$loading.finish('loading');
		});

		$scope.$on('$destroy', function() {
			startLoadingListener();
			stopLoadingListener();
		});

	}
])

.controller('HeaderController', function() {


});