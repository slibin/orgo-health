angular.module('groceryworld.controllers')
.controller('ConnectionCtrl', function($scope,$rootScope,$location,$ionicLoading,$localStorage,$timeout,$cordovaNetwork,usersService,dashboardService,shoppingcartService,alertmsgService,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';

	//$localStorage.apiAccessToken ='';
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

	$rootScope.noConnection = false;
	document.addEventListener("deviceready", function () {
		$scope.checkConnection();
    }, false);

	$scope.checkConnection = function(){
		$ionicLoading.show({ template: '<ion-spinner icon="spiral"></ion-spinner>'});

		    var isOnline = $cordovaNetwork.isOnline();
			if(isOnline){
				$rootScope.isOnline = true;
				$scope.noConnection = false;
				$ionicLoading.hide();
				$scope.checkUserStatus();
			}else{
				//--------------------------
					if(window.Connection) {
						if(navigator.connection.type == Connection.NONE) {
							$rootScope.isOnline = false;
							$scope.noConnection = true;
							$ionicLoading.hide();
						}else{
							$rootScope.isOnline = true;
							$scope.noConnection = false;
							$ionicLoading.hide();
							$scope.checkUserStatus();

						}
					}
				//--------------------------
			}
	}
	//-----------------------------------
		$scope.getAccessToken = function(){
			dashboardService.getAccessToken()
			.then(function(response) {
					if(response.success && response.accesstoken!=null){
						$localStorage.apiAccessToken = response.accesstoken;
						$scope.checkUserStatus();
					}else{
						alertmsgService.showMessage('Unauthorized Access.');
					}
			}, function(error) {
				alertmsgService.tostMessage(error);
			});
		}
	//-----------------------------------
	$rootScope.checkToken =false;
	//$ionicHistory.nextViewOptions({  disableAnimate: true,disableBack: true  });
	//$location.path('app/dashboard');
	$scope.checkUserStatus = function(){
		$rootScope.userData = [];
		usersService.userDetails()
		.then(function(response) {

			//If the access token expired or invalid.
			if((response.statusCode=='400' || response.statusCode=='401') && response.statusText=='Unauthorized'){
				$scope.getAccessToken();
				$rootScope.checkToken =true;
			}else{
				$ionicHistory.nextViewOptions({  disableAnimate: true,disableBack: true  });
				if(response.success){
					$rootScope.userData = response.data;
					//$scope.moveToDashboard();
					$ionicSideMenuDelegate.canDragContent(true); // hide sidemenu
					$location.path('app/dashboard');
				}else{
					$location.path('app/iniscreen');
				}
			}
		}, function(error) {
			alertmsgService.tostMessage(error);
			$location.path('app/iniscreen');
		});
	}
	//-----------------------------------
	$scope.moveToDashboard = function(){
		$ionicSideMenuDelegate.canDragContent(true); // hide sidemenu

		shoppingcartService.emptyCart()
		.then(function(response) {
			$location.path('app/dashboard');
		}, function(error) {
			$location.path('app/dashboard');
		});
	}
	//-----------------------------------

	$scope.checkUserStatus();
});
