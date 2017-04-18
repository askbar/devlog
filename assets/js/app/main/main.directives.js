angular.module('devlog.main.directives', [])

.directive('fileBrowser', ['FileSystem', 'lodash', 
	function(FileSystem, _) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'assets/js/app/main/templates/directives/fileBrowser',
        scope: {
            selectedPath: '='
        },
        link: function(scope, element) {

        	scope.result = {};

        	scope.fetch = function(id) {
        		FileSystem.tree.query({
        			id: id
        		}).$promise.then(function(result) {
        			scope.result = result;
        			scope.result.files = _.sortBy(scope.result.files, 'isDirectory');
        		}, function(result) {
        			console.log('error', result);
        		});
        	};

        	scope.up = function() {
        		FileSystem.up.query({
        			id: scope.result.currentDir
        		}).$promise.then(function(result) {
        			scope.result = result;
        			scope.result.files = _.sortBy(scope.result.files, 'isDirectory');
        		}, function(result) {
        			console.log('error', result);
        		});
        	};

        	scope.navigate = function() {
        		scope.fetch(scope.result.currentDir);
        	};

        	scope.select = function(id) {
        		FileSystem.tree.query({
        			id: id
        		}).$promise.then(function(result) {
        			scope.result = result;
        			scope.result.files = _.sortBy(scope.result.files, 'isDirectory');
        		}, function(result) {
        			console.log('error', result);
        		});
        	};

        	scope.add = function(id) {
        		scope.selectedPath = id;
        	};

        	scope.fetch(scope.selectedPath);
        }
    };
}]);