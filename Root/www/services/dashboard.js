angular.module('groceryworld.services')
.factory('dashboardService', function(httpRequestFactory) {
  'use strict';

  var service = {
    getBanners: function () {
		return httpRequestFactory.getRequest('appbanners');
    },
	 getAccessToken: function () {
		return httpRequestFactory.postRequest('createaccesstoken');
    },
	 storeDeviceToken: function (data) {
		return httpRequestFactory.postRequest('deviceregister',data);
    },
	 getAppVersion: function (data) {
		return httpRequestFactory.getRequest('appversion',data);
    }
  };

  return service;
});


//waze