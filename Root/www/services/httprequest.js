 angular.module('groceryworld.services')

.factory('httpRequestFactory', function($http,$rootScope,$localStorage,$q,$ionicLoading,alertmsgService,$timeout,APIURL,CANCELORDER) {

  var requestTimeout = 30000;
  if(typeof($localStorage.apiAccessToken)!='undefined' && $localStorage.apiAccessToken!=''){
	  $http.defaults.headers.common['Authorization'] = 'Bearer '+$localStorage.apiAccessToken;
	  $http.defaults.headers.common['X-Oc-Image-Dimension'] = '300x300';
  }

  return {

  	setHeader: function() {
  		$http.defaults.headers.common['Authorization'] = 'Bearer '+$localStorage.apiAccessToken;
  		$http.defaults.headers.common['X-Oc-Image-Dimension'] = '300x300';
  	},
    getRequest: function(request,loader) {
		  $rootScope.requestTimeout = false;
		  if($rootScope.checkToken){ this.setHeader();	}
		  if(typeof(loader)=='undefined' || loader=='Y' ) $ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>'});

		  var timeout = $q.defer(), result = $q.defer(), timedOut = false;
		  var deferred = $q.defer();

		   $timeout(function() { timedOut = true; timeout.resolve(); }, requestTimeout);

		   //console.log(request);
		   $http({method:'GET',url: APIURL+request,cache:false,timeout: timeout.promise})
			.success(function(data) {
			  deferred.resolve(data);
			  $ionicLoading.hide();
			})
			.error(function(data) {
				$rootScope.requestTimeout = true;
				if (timedOut) {
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                } else {
                    deferred.reject(data);
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                }
			});

		return deferred.promise;
    },
	   postRequest: function(request,postdata,loader) {
		  if(typeof(loader)=='undefined' || loader=='Y' )$ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>'});

		  var timeout = $q.defer(), result = $q.defer(), timedOut = false;
		  var deferred = $q.defer();

		  $timeout(function() { timedOut = true; timeout.resolve(); }, requestTimeout);

		   $http({method:'POST',url:APIURL+request,cache: false,data:postdata,timeout:timeout.promise})
			.success(function(data) {
			  deferred.resolve(data);
			    $ionicLoading.hide();
			})
        .error(function(data) {
          if (timedOut) {
            $ionicLoading.hide();
            alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
          }else{
            deferred.reject(data);
            $ionicLoading.hide();
            alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
          }
        });
		return deferred.promise;
	},
	deleteRequest: function(request,postdata,loader) {
		  if(typeof(loader)=='undefined' || loader=='Y' )$ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>'});
		  var timeout = $q.defer(), result = $q.defer(), timedOut = false;
		  var deferred = $q.defer();
		  $timeout(function() { timedOut = true; timeout.resolve(); }, requestTimeout);

		   $http({method:'DELETE',url:APIURL+request,cache: false,data:postdata,timeout:timeout.promise})
			.success(function(data) {
			  deferred.resolve(data);
			    $ionicLoading.hide();
			})
			.error(function(data) {
				if (timedOut) {
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                } else {
                    deferred.reject(data);
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                }
			});

		return deferred.promise;
	},
	putRequest: function(request,postdata,loader) {


		  if(typeof(loader)=='undefined' || loader=='Y' )$ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>'});

		  var timeout = $q.defer(), result = $q.defer(), timedOut = false;

		  var deferred = $q.defer();

		   $timeout(function() { timedOut = true; timeout.resolve(); }, requestTimeout);


		   $http({method:'PUT',url:APIURL+request,cache: false,data:postdata,timeout:timeout.promise})
			.success(function(data) {
			  deferred.resolve(data);
			    $ionicLoading.hide();
			})
			.error(function(data) {
				if (timedOut) {
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                } else {
                    deferred.reject(data);
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                }
			});

		return deferred.promise;
	},
    cancelOrder: function(order_id,loader) {

		  $rootScope.requestTimeout = false;

		  if($rootScope.checkToken){ this.setHeader();	}

		  if(typeof(loader)=='undefined' || loader=='Y' ) $ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>'});

		  var timeout = $q.defer(), result = $q.defer(), timedOut = false;
		  var deferred = $q.defer();

		   $timeout(function() { timedOut = true; timeout.resolve(); }, requestTimeout);


		   $http({method:'GET',url:CANCELORDER+order_id,cache:false,timeout: timeout.promise})
			.success(function(data) {
			  deferred.resolve(data);
			  $ionicLoading.hide();
			})
			.error(function(data) {
				$rootScope.requestTimeout = true;
				if (timedOut) {
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                } else {
                    deferred.reject(data);
					$ionicLoading.hide();
					alertmsgService.tostMessage('Request Timeout. The request has taken too much time to process.');
                }
			});

		return deferred.promise;
    }
  };

});

 angular.module('groceryworld.services')
.factory('progressService', function($ionicLoading) {

  //-----------------------------------------------
  //Show and hide progress indicator for loading actions

  var service = {
    showLoader: function(text) {
      if (!text) text = '<ion-spinner icon="spiral"></ion-spinner>';
      $ionicLoading.show({template: text});
    },

    hideLoader: function() {    $ionicLoading.hide();   }
  };

  return service;
});


angular.module('groceryworld.services')
.factory('alertmsgService', function($ionicPopup,$cordovaToast,$cordovaInAppBrowser) {

  var service = {
         showMessage: function(msg) {
			$ionicPopup.alert({
			   title: 'Information', template: msg,
			   buttons: [ { text: 'OK',type: 'button-balanced', } ]
			});
         },
         tostMessage: function(msg){
            $cordovaToast
             .showShortTop(msg)
             .then(function(success) {
               // success
               }, function (error) {
               // error
               });
            },
		 tostBMessage:function(msg){
			  $cordovaToast.showLongBottom(msg).then(function(success) {
				// success
			  }, function (error) {
				// error
			  });
		 },
		 appUpdate:function(newVersion){

				//-----------------------------------------------------
				$ionicPopup.show({
					title: 'Update Star Bazaar',
					subTitle: 'This version of Grocery World need to be updated. Update to the latest version '+newVersion,
					//scope: $scope,
					buttons: [
					  { text: 'Cancel',type: 'button-light' },
					  {	text: 'Update',type: 'button-balanced',	onTap: function(e) {
							//---------------------------
							var options = {location: 'yes',clearcache: 'yes',toolbar:'no'};
							$cordovaInAppBrowser.open('https://play.google.com/store/apps/details?id=com.opensourcetechnologies.groceryworld', '_system', options)
							  .then(function(event) {
								$cordovaInAppBrowser.close();
							  })
							  .catch(function(event) {
								$cordovaInAppBrowser.close(); // error
							  });
							//---------------------------
						}
					  }
					]
				  });
			//-----------------------------------------------------

		 }
      };

    return service;
});
