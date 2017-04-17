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
      if (_.isArray(response.data)) {
        return _.map(response.data, function(v) {
          return new ProfileModel(v);
        });
      }
      else {
        return ProfileModel(response.data);
      }
    }
  }
}])

.factory('ProfileModel', ['lodash',
  function(_) {

    var ProfileModel = function(data) {
      angular.extend(this, data);
      this.pathContents = {};
      this.currentlyViewedPath = -1;
      _.each(this.paths, function(path) {
        this.pathContents[path] = [];
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
        this.pathContents[path].push(v);
      },
      getCurrentlyViewedPath: function() {
        return this.currentlyViewedPath;
      },
      setCurrentlyViewedPath: function(v) {
        this.currentlyViewedPath = v;
      },
      // Helper to determine if this profile has the 
      // the given path
      hasPath: function(v) {
        return _.gte(_.indexOf(this.paths, v), 0);
      }
    };

    return ProfileModel;
  }]);