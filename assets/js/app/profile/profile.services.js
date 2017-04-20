angular.module('devlog.profile.services', [])

.provider('Profile', function() {
  return {
    $get: function($resource) {
      var Profile = $resource('profiles/:id', {
        id: '@id'
      }, {
        query: {
          method: 'GET',
          isArray: true,
          interceptor: 'ProfileInterceptor'
        },
        get: {
          method: 'GET',
          isArray: false,
          interceptor: 'ProfileInterceptor'
        },
        update: {
          method: 'PUT'
        }
      });
      return Profile;
    }
  };
})

.factory('ProfileInterceptor', ['ProfileModel', 'lodash', function(ProfileModel, _) {
  return {
    response: function(response) {
      if (_.isArray(response.resource)) {
        return _.map(response.resource, function(v) {
          return new ProfileModel(v);
        });
      }
      else {
        return ProfileModel(response.resource);
      }
    }
  };
}])

.factory('ProfileModel', ['lodash',
  function(_) {

    var ProfileModel = function(data) {
      
      _.extend(this, data);

      this.pathInView = {};
      this.pathContents = {};
      this.pathInitialContentsLoaded = {};

      _.each(this.paths, function(path, index) {
        this.pathInView[path] = false;
        this.pathContents[path] = [];
        this.pathInitialContentsLoaded[path] = false;
      }.bind(this));

    };

    ProfileModel.prototype = {
      getId: function() {
        return this.id;
      },
      getName: function() {
        return this.name;
      },
      getPaths: function() {
        return this.paths;
      },
      getPathContents: function() {
        return this.pathContents;
      },
      setPathContents: function(v) {
        this.pathContents = v;
      },
      getPathContent: function(path) {
        return this.pathContents[path];
      },
      setPathContent: function(path, v) {
        if (_.isArray(v)) {
          _.extend(this.pathContents[path], v);
        }
        else if (_.isString(v)) {
          this.pathContents[path].push(v);
        }
      },
      setInitialContentLoadedForPath: function(path, v) {
        this.pathInitialContentsLoaded[path] = v;
      },
      isInitialContentLoadedForPath: function(path) {
        return this.pathInitialContentsLoaded[path];
      },
      setPathInView: function(path) {
        this.pathInView = _.mapValues(this.pathInView, function(v, k) {
          if (_.eq(k, path)) {
            v = true;
          }
          else {
            v = false;
          }
          return v;
        });
      },
      isPathInView: function(path) {
        return this.pathInView[path];
      },
      // Helper to determine if this profile has the 
      // the given path
      hasPath: function(v) {
        return _.gte(_.indexOf(this.paths, v), 0);
      },
      // Helper to set path content
      setPathContentByPath: function(path, v) {
        if (this.hasPath(path)) {
          this.setPathContent(path, v);
        }
      }
    };

    return ProfileModel;
  }]);