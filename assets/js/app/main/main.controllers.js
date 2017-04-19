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
		$scope.tailErrorCb = function(data) {
			$scope.$apply(function() {
				$rootScope.$broadcast('$socketTailError', data);
			});
		};

		io.socket.on('newLine', $scope.newLineCb);
		io.socket.on('startTail', $scope.startTailCb);
		io.socket.on('stopTail', $scope.stopTailCb);
		io.socket.on('tailError', $scope.tailErrorCb);

		$scope.$on('$destroy', function() {
			io.socket.off('newLine', $scope.newLineCb);
			io.socket.off('startTail', $scope.startTailCb);
			io.socket.off('stopTail', $scope.stopTailCb);
			io.socket.off('tailError', $scope.tailErrorCb);
			startLoadingListener();
			stopLoadingListener();
		});
	}
])

.controller('HeaderController', function() {


});