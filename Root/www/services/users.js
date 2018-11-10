angular.module('groceryworld.services')
.factory('usersService', function(httpRequestFactory,$rootScope,$http) {
  'use strict';

  var service = {
    userRegister: function (data) {
		 return httpRequestFactory.postRequest('register',data);
	},
	userRegister1: function (data) {
		return httpRequestFactory.postRequest('guest/register',data);
   },
	userLogin: function (data) {
		 return httpRequestFactory.postRequest('login',data);
    },
	userForgotten: function (data) {
		 return httpRequestFactory.postRequest('forgotten',data);
    },
	userDetails: function () {
		 return httpRequestFactory.getRequest('account');
    },
	userChagnepwd: function (data) {
		 return httpRequestFactory.putRequest('account/password',data);
    },
	profileUpdate: function (data) {
		 return httpRequestFactory.postRequest('account',data);
	},
	contactAdd: function (data) {
		return httpRequestFactory.postRequest('contact',data);
   },
	userLogout: function () {
		 return httpRequestFactory.postRequest('logout');
    },
	getCountries: function () {
		 return httpRequestFactory.getRequest('countries');
    },
	getStates: function () {
		 return $http.get('data/states.json','GET');
    },
	getOrders: function () {
		 return httpRequestFactory.getRequest('customerorders');
    },
	getOrdersDetail: function (order_id) {
    //console.log(order_id);
		 return httpRequestFactory.getRequest('customerorders/'+order_id);
    },
	removeAddress: function (address_id) {
		 return httpRequestFactory.deleteRequest('account/address/'+address_id);
    },
	verifyLocation: function (data) {
		 return httpRequestFactory.postRequest('location',data);
	},
	getLogo: function () {
		return httpRequestFactory.getRequest('logo');
   },
   offer: function () {
	return httpRequestFactory.getRequest('colist');
},
  };

  return service;
});
