angular.module('groceryworld.services')
.factory('$localStorage', ['$window', function($window) {
  var service = {
    set: function(key, value) {
      if (typeof value === 'object') {
        $window.localStorage[getTypeKey(key)] = 'object';
        $window.localStorage[key] = JSON.stringify(value);
      } else {
        service.remove(getTypeKey(key));
        $window.localStorage[key] = value;
      }
      return service.get(key);
    },
    get: function(key) {
      if ($window.localStorage[getTypeKey(key)] === 'object' && $window.localStorage[key]) {
        return JSON.parse($window.localStorage[key]);
      } else {
        return $window.localStorage[key];
      }
    },
    remove: function (key) {
      $window.localStorage.removeItem(getTypeKey(key));
      $window.localStorage.removeItem(key);
    }
  };

  return service;
}]);

function getTypeKey (key) {
  return key + '___type';
}
