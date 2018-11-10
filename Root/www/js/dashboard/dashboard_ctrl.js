angular.module('groceryworld.controllers')
.controller('DashboardCtrl', function($scope,$rootScope,$ionicModal,$ionicLoading,usersService,categoryService,dashboardService, $ionicSlideBoxDelegate,$ionicScrollDelegate,$localStorage,$ionicPlatform,$timeout,$ionicHistory,$ionicSideMenuDelegate,$cordovaAppVersion,alertmsgService,ionicMaterialInk) {
	'use strict';
//	$rootScope.hideTabs = 0;
	usersService.getLogo()
	.then(function(response) {
			$scope.logo = response.data;
			console.log($scope.logo);
	});
	$rootScope.isCartIconVisible = true;

	$scope.nextSlide = function(){
		$ionicSlideBoxDelegate.next();
	}
	//-------------Check for App New Version----------------------
/*	document.addEventListener("deviceready", function () {
	 $cordovaAppVersion.getVersionNumber().then(function (version) {
		 var cVArray = version.split(".");
		 var cVSum 	=  parseInt(cVArray[0])*1000+parseInt(cVArray[1])*100+parseInt(cVArray[2])*10;
		 //conslle.log('cVSum',cVSum);
			//--------------------
			 dashboardService.getAppVersion().then(function(response){
				 if(response.success){
					 var vArray = response.data.split(".");
					 var backendVSum =  parseInt(vArray[0])*1000+parseInt(vArray[1])*100+parseInt(vArray[2])*10;

					//For version update
					//  if(backendVSum>cVSum){
					// 		alertmsgService.appUpdate(response.data);
					//  }
				 }
				});
			//--------------------
	 });
 }, false); */
	//------------------------------------------------------------

	$ionicSideMenuDelegate.canDragContent(true); // hide sidemenu

	$scope.getCartData(); // show cart items total
	//--------Get Category------------------------

    if(typeof($localStorage.categories)=='undefined' || $localStorage.categories==''){
		categoryService.getCategories()
		.then(function(response) {

			//console.log(response.data);
			$localStorage.categories = response.data;
			$rootScope.accordionArray = response.data;
			$rootScope.searchDefaultCats = getAutoSuggest($rootScope.accordionArray);
		}, function(error) {
			alertmsgService.tostMessage(error);
		});

	}else{

		$rootScope.accordionArray = $localStorage.categories;
		$rootScope.searchDefaultCats = getAutoSuggest($rootScope.accordionArray);

		categoryService.getCategories()
		.then(function(response) {
			if(response.success){

				$localStorage.categories = response.data;
				$rootScope.accordionArray = response.data;
				$rootScope.searchDefaultCats = getAutoSuggest($rootScope.accordionArray);
			}
		});
	}

	//--------Banners------------------------
		$scope.mainSlider = [];
		$scope.mainAds	  = [];

		dashboardService.getBanners()
		.then(function(response) {
			if(response.success){
				$scope.mainSlider = response.appbanners.slider;
        console.log($scope.mainSlider);  
				$scope.mainAds	  = response.appbanners.ads;
				console.log($scope.mainAds);
				$ionicSlideBoxDelegate.update();
			}
		}, function(error) {
			alertmsgService.tostMessage(error);
		});
// //-----------------Get Accesds Token --------------------------
// dashboardService.getAccessToken()
// .then(function(response) {
// 	if(response.success){
// 		$rootScope.accessToken = response.accesstoken;
// 	}
// }, function(error) {
// 	alertmsgService.tostMessage(error);
// });
	//--------Get User Data---------------------
	if($rootScope.userData=='' || typeof($rootScope.userData)=='undefined'){
		usersService.userDetails()
		.then(function(response) {
			if(response.success){
				$rootScope.userData	 = response.data;
			}
		});
	}
	//----------------------------------

	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		if(toState.name=='app.dashboard'){
			$scope.isDashboard = true;
			$scope.checkExitApp();
		}else if(toState.name=='app.order-status'){
			$scope.isDashboard = false;
		}else{
			$scope.isDashboard = false;
			$scope.checkExitApp();
		}

	});

	$scope.checkExitApp = function(){
			$scope.exitApp = false;
			$ionicPlatform.registerBackButtonAction(function(e) {
				if($scope.isDashboard){
				   e.preventDefault();
				   if(!$scope.exitApp){
						alertmsgService.tostBMessage('Press again to exit.');
						$scope.exitApp = true;
						$timeout(function(){$scope.exitApp = false;},4000);
				   }else{
						ionic.Platform.exitApp();
				   }
				}else {
					$ionicHistory.goBack();
				}
			}, 101);
	}
	$scope.isDashboard = true;
	$scope.checkExitApp();
	//----------------------------------

	ionicMaterialInk.displayEffect();
});
