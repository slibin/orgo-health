angular.module('groceryworld.services')
.factory('categoryService', function(httpRequestFactory) {
  'use strict';

  var service = {
    getCategories: function () {
		 return httpRequestFactory.getRequest('menucategories/level/2/');
    }
  };

  return service;
});