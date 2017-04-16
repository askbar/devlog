angular.module('devlog.logger.controllers', [])

.controller('LoggerController', [
	'$scope', '_watchers', 'lodash', 'Logger',
	function($scope, _watchers, _, Logger) {
	
		$scope.watchers = _watchers;

		$scope.newLineCb = function(data) {
			console.log('newLineCb', data);
			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.params.id);
			});
		};

		$scope.startTailCb = function(data) {
			console.log('startTailCb', data);
			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.params.id);
			});
			watcher.setPid(data.params.pid);
		};

		$scope.stopTailCb = function(data) {
			console.log('stopTailCb', data);
			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.params.id);
			});
			watcher.setPid(null);
		};

		// Receving a message
		io.socket.on('newLine', $scope.newLineCb);
		// Tail started
		io.socket.on('startTail', $scope.startTailCb);
		// Tail stopped
		io.socket.on('stopTail', $scope.stopTailCb);

		$scope.action = function(watcher) {

			if (!watcher.getStarted()) {
				Logger.start({
					operation: 'startTail',
					params: {
						id: watcher.getId(),
						paths: watcher.getAllPaths()						
					}
				});
			}
			else {
				Logger.stop({
					operation: 'stopTail', 
					params: {
						id: watcher.getId(),
						pid: watcher.getPid()						
					}
				});
			}

			watcher.setStarted(!watcher.getStarted());
		};

		$scope.$on('$destroy', function() {
			
			// Stop any ongoing watchers
			_.each($scope.watchers, function(watcher) {
					if (watcher.getStarted()) {
						$scope.action(watcher);
					}
			}); 

			// Receving a message
			io.socket.off('newLine', $scope.newLineCb);
			// Tail started
			io.socket.off('startTail', $scope.startTailCb);
			// Tail stopped
			io.socket.off('stopTail', $scope.stopTailCb);

			$scope.watchers = null;
		});

	}]);