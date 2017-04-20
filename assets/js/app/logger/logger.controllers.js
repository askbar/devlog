angular.module('devlog.logger.controllers', [])

.controller('LoggerController', [
	'$scope', '$rootScope', '_watchers', 'lodash', 'Logger',
	function($scope, $rootScope, _watchers, _, Logger) {
	
		$scope.watchers = _watchers;

		var startTailEvent = $rootScope.$on('$socketStartTail', function(e, data) {
			$scope.watchers = _.map($scope.watchers, function(watcher) {
				if (_.eq(watcher.getId(), data.watcher.id)) {
					watcher.setTailing(data.watcher.tailing);
				}
				return watcher;
			});
		});

		var newLineEvent = $rootScope.$on('$socketNewLine', function(e, data) {
			var watcher = _.find($scope.watchers, function(watcher) {
				return _.eq(watcher.getId(), data.id);
			});
			console.log('newLineEvent', data, 'watcher', watcher);
			watcher.setPathContentByPath(data.path, data.line);	
		});

		var stopTailEvent = $rootScope.$on('$socketStopTail', function(e, data) {
			$scope.watchers = _.map($scope.watchers, function(watcher) {
				if (_.eq(watcher.getId(), data.watcher.id)) {
					watcher.setTailing(data.watcher.tailing);
				}
				return watcher;
			});
		});

		var tailErrorEvent = $rootScope.$on('$socketTailError', function(e, data) {
			console.log('tailErrorEvent', data);
		});

		// Start or stop logging a watcher profile
		$scope.action = function(watcher) {
			if (watcher.getTailing()) {
				Logger.stop({
					id: watcher.getId()
				});
			}
			else {
				Logger.start({
					id: watcher.getId()
				});
			}
		};

		$scope.view = function(watcher, profile, path) {

			console.log('view', watcher, profile, path);

			if (!profile.isInitialContentLoadedForPath(path)) {
				Logger.contents.get({
					path: path,
					lines: watcher.getLines()
				}).$promise.then(function(response) {
					profile.setInitialContentLoadedForPath(response.path, true);
					profile.setPathContentByPath(response.path, response.lines);
				}, function(result) {
					console.log('error', result);
				});
			}
		};

		// Open first watcher by default
		if (!_.isEmpty($scope.watchers)) {
			_.each($scope.watchers, function(watcher) {
				if (watcher.getTailing()) {
					watcher.setOpened(true);
					$scope.action(watcher);
				}
				else if (watcher.getAutomatic()) {
					watcher.setOpened(true);
					$scope.action(watcher);
				}
			});
		}

		$scope.$on('$destroy', function() {
			startTailEvent();
			stopTailEvent();
			newLineEvent();
			tailErrorEvent();
			$scope.watchers = null;
		});

	}]);