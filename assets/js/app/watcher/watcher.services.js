angular.module('devlog.watcher.services', [])

.provider('Watcher', function() {
  return {
    $get: ['lodash', '$resource', 'WatcherInterceptor', function(_, $resource, WatcherInterceptor) {
      var Watcher = $resource('watchers/:id', {
        id: '@id'
      }, {
        query: {
          method: 'GET',
          isArray: true,
          interceptor: WatcherInterceptor
        },
        get: {
          method: 'GET',
          isArray: false,
          interceptor: WatcherInterceptor          
        },
        update: {
          method: 'PUT'
        }
      });
      return Watcher;
    }]
  };
})

.factory('WatcherInterceptor', ['WatcherModel', 'lodash', function(WatcherModel, _) {
  return {
    response: function(response) {
      if (_.isArray(response.resource)) {
        return _.map(response.resource, function(v) {
          return new WatcherModel(v);
        });
      }
      else if (_.isObject(response.resource)) {
        return WatcherModel(response.resource);
      }
    }
  };
}])

.factory('WatcherModel', ['lodash', 'ProfileModel', function(_, ProfileModel) {

    var WatcherModel = function(data) {

      _.extend(this, data);
      
      // Runtime props
      this.opened = false;
      this.started = false;
      this.pid = null;

      this.profiles = _.map(this.profiles, function(profile) {
        return new ProfileModel(profile);
      });
      return this;
    };

    WatcherModel.prototype = {
      getId: function() {
        return this.id;
      },
      getName: function() {
        return this.name;
      },
      getProfiles: function() {
        return this.profiles;
      },
      getLines: function() {
        return this.lines;
      },
      setLines: function(v) {
        this.lines = v;
      },
      getStarted: function() {
        return this.started;
      },
      setStarted: function(v) {
        this.started = v;
      },
      getOpened: function() {
        return this.opened;
      },
      setOpened: function(v) {
        this.opened = v;
      },
      getPid: function() {
        return this.pid;
      },
      setPid: function(v) {
        this.pid = v;
      },
      getAllPaths: function() {
        var paths = [];
        _.each(this.profiles, function(profile) {
          _.extend(paths, profile.getPaths());
        });
        return paths;
      },
      // Helper method to find all profiles that contain the given path
      getProfilesByPath: function(path) {
        var profiles = this.getProfiles();
        return _.filter(profiles, function(profile) {
           return profile.hasPath(path);
        });
      },
      // Helper to set path content
      setPathContentByPath: function(path, line) {
        var profiles = this.getProfiles();
        _.each(profiles, function(profile) {
          if (profile.hasPath(path) && profile.isInitialContentLoadedForPath(path)) {
            profile.setPathContent(path, line);
          }
        });
      }

    };

    return WatcherModel;
  }
]);