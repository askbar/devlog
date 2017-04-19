angular.module('devlog.logger.controllers', [])

.controller('LoggerController', [
	'$scope', '$rootScope', '_watchers', 'lodash', 'Logger',
	function($scope, $rootScope, _watchers, _, Logger) {
	
		$scope.watchers = _watchers;

		// Open first watcher by default
		if (!_.isEmpty($scope.watchers)) {
			_.first($scope.watchers).setOpened(true);
		}

		var startTailEvent = $rootScope.$on('$socketStartTail', function(e, data) {
			$scope.watchers = _.map($scope.watchers, function(watcher) {
				if (_.eq(watcher.getId(), data.id)) {
					watcher.setTailing(data.tailing);
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
				if (_.eq(watcher.getId(), data.id)) {
					watcher.setTailing(data.tailing);
				}
				return watcher;
			});
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

		$scope.view = function(e, watcher, profile, path) {
			e.preventDefault();
			
			profile.setPathInView(path); // Makes this path current

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

		$scope.$on('$destroy', function() {
			startTailEvent();
			stopTailEvent();
			newLineEvent();
			$scope.watchers = null;
		});

	}]);