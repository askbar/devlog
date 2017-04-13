angular.module('devlog.logger.controllers', [])

.controller('LoggerController', [
	'$scope', '_watchers', 'lodash',
	function($scope, _watchers, _) {
		
		$scope.watchers = _.mapValues(_watchers, function(v, k) {
			v.isOpened = false;
			v.start = false; // Indicate if this watcher profile should be started
			v.started = false; // Indicate if this watcher profile is running
			return v;
		});

		$scope.runWatchers = function() {
			_.each($scope.watchers, function(watcher) {
				if (watcher.start && !watcher.started) {
					_.each(watcher.profiles, function(profile) {
						_.each(profile.paths, function(path) {
							socket.on()
						});
					});
				}
			});
		};

		$scope.$on('$destroy', function() {
			$scope.watchers = null;
		});

	}]);