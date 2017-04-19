angular.module('devlog.main.controllers', [])

.controller('MainController', ['$log', '$scope', '$rootScope', '$loading', 
	function($log, $scope, $rootScope, $loading) {

		var startLoadingListener = $rootScope.$on('$startLoading', function() {
			$loading.start('loading');
		});

		var stopLoadingListener = $rootScope.$on('$stopLoading', function() {
			$loading.finish('loading');
		});

		$scope.newLineCb = function(data) {
			$scope.$apply(function() {
				$rootScope.$broadcast('$socketNewLine', data);
			});
		};
		$scope.startTailCb = function(data) {
			$scope.$apply(function() {
				$rootScope.$broadcast('$socketStartTail', data);
			});
		};
		$scope.stopTailCb = function(data) {
			$scope.$apply(function() {
				$rootScope.$broadcast('$socketStopTail', data);
			});

		};

		// Receving a message
		io.socket.on('newLine', $scope.newLineCb);
		// Tail started
		io.socket.on('startTail', $scope.startTailCb);
		// Tail stopped
		io.socket.on('stopTail', $scope.stopTailCb);


		$scope.$on('$destroy', function() {

			// Receving a message
			io.socket.off('newLine', $scope.newLineCb);
			// Tail started
			io.socket.off('startTail', $scope.startTailCb);
			// Tail stopped
			io.socket.off('stopTail', $scope.stopTailCb);

			startLoadingListener();
			stopLoadingListener();

		});

	}
])

.controller('HeaderController', function() {


});