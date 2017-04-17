angular.module('devlog.logger.controllers', [])

.controller('LoggerController', [
	'$scope', '_watchers', 'lodash', 'Logger',
	function($scope, _watchers, _, Logger) {
	
		$scope.watchers = _watchers;

		// Open first watcher by default
        _.first($scope.watchers).setOpened(true);


		$scope.newLineCb = function(data) {
			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.params.id);
			});
			console.log('newLineCb', data, 'watcher', watcher);
			watcher.setPathContentByPath(data.params.path, data.params.line);
			$scope.$apply();
		};

		$scope.startTailCb = function(data) {

			console.log('startTailCb', data);

			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.params.id);
			});

			watcher.setStarted(true);
			watcher.setPid(data.params.pid);

			$scope.$apply();
		};

		$scope.stopTailCb = function(data) {
			
			console.log('stopTailCb', data);

			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.params.id);
			});

			watcher.setStarted(false);
			watcher.setPid(null);

			$scope.$apply();
		};

		// Receving a message
		io.socket.on('newLine', $scope.newLineCb);
		// Tail started
		io.socket.on('startTail', $scope.startTailCb);
		// Tail stopped
		io.socket.on('stopTail', $scope.stopTailCb);


		// Start or stop logging a watcher profile
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

		};

		$scope.view = function(e, watcher, profile, path) {
			e.preventDefault();
			
			profile.setPathInView(path); // Makes this path current

			if (!profile.isInitialContentLoadedForPath(path)) {
				Logger.read({
					path: path
				}, function(resData, jwres) {
					// console.log('view', resData, jwres);
					profile.setInitialContentLoadedForPath(path, true);
					profile.setPathContentByPath(resData.path, resData.lines);
					$scope.$apply();
				});
			}
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