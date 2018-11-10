angular.module('groceryworld.controllers')
.controller('IniscreenCtrl', function($scope,$rootScope,$location,usersService,$ionicSideMenuDelegate,$ionicHistory,shoppingcartService,progressService) {
	'use strict';
//	document.getElementById("ini").style.backgroundColor = "red";
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

	//shoppingcartService.emptyCart().then(function(response) {	});
	// $scope.$on('$ionicView.beforeEnter', function(ev, info) {
	// 	$rootScope.hideTabs = 1;
	// });
	
	$scope.loginButton = function(){ $location.path("app/inilogin"); }
	$scope.signupButton = function(){ $location.path("app/inisignup"); }
	$scope.skipButton = function(){ $location.path("app/select-location"); }
	usersService.getLogo()
	.then(function(response) {
			$scope.logo = response.data;
			console.log($scope.logo);
	});
	progressService.hideLoader();

})

.controller('IniLocationCtrl', function($scope,$rootScope,$location,$cordovaGeolocation,$timeout,usersService,progressService,$ionicSideMenuDelegate,alertmsgService,$ionicHistory) {
	'use strict';
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu
	//$rootScope.hideTabs = 1;
	$scope.getAddress = function(attrs){
			progressService.showLoader();
			var geocoder = new google.maps.Geocoder();
			var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
			geocoder.geocode({ 'latLng': latlng }, function (results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					if (results[1]) {
						$scope.userAddress = results[1].formatted_address;
						progressService.hideLoader();
						$timeout(function(){ $location.path("app/dashboard");  }, 1500);
					} else {
						$scope.userAddress = 'Location not found';
						progressService.hideLoader();
					}
				} else {
					$scope.userAddress = 'Geocoder failed due to: ' + status;
					progressService.hideLoader();
				}
			});
	}

	$scope.findLocation = function(){
		  var posOptions = {timeout: 10000, enableHighAccuracy: false};
		  $cordovaGeolocation
			.getCurrentPosition(posOptions)
			.then(function (position) {
			  var lat  = position.coords.latitude
			  var lng = position.coords.longitude

				usersService.verifyLocation({lng:lng,lat:lat})
				.then(function(response) {
						if(response.success){
							$scope.getAddress({lat:lat,lng:lng});
						}else{
							$scope.userAddress  = '';
							alertmsgService.showMessage(response.message);
						}
				});

			}, function(err) {
				 progressService.hideLoader();
		  });
	}

	//$scope.findLocation();

    $scope.setLocation = function(data){
		$scope.userLocation = data;

		var lng  = data.geometry.location.lng();
		var lat  = data.geometry.location.lat();

		usersService.verifyLocation({lng:lng,lat:lat})
		.then(function(response) {

				if(response.success){
					$scope.userAddress  = $scope.userLocation.formatted_address;
					$timeout(function(){ $location.path("app/dashboard");  }, 1000);
				}else{
					$scope.userAddress  = '';
					alertmsgService.showMessage(response.message);
				}
		});


	}


})


.controller('IniSignupCtrl', function($scope,$rootScope,$location,usersService,alertmsgService,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';
//	$rootScope.hideTabs = 1;
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu
	//$scope.stateData=[{zone_id:'',name:'-- Select State --'}];
	$scope.stateData=[];
	$scope.regLocation = function(data){
		$scope.userLocation = data;

		var lng  = data.geometry.location.lng();
		var lat  = data.geometry.location.lat();
		var lnglat = {lng:lng,lat:lat};
		usersService.verifyLocation(lnglat)
		.then(function(response) {
				if(response.success){
					$scope.iniRegister.city  = $scope.userLocation.formatted_address;
				}else{
					$scope.iniRegister.city  = '';
					console.log(response);
					alertmsgService.showMessage(response.message);
				}
		});
	}

	usersService.getCountries()
	.then(function(response) {
		if(response.success){
			$scope.cuntryData = [{country_id:'',name:'-- Select Country --'}];
			$scope.cuntryData = $scope.cuntryData.concat(response.data);
			console.log($scope.cuntryData);
		}
	});

	//--- States loading service ---
/*	$scope.getData =function(){
		usersService.getStates()
	.then(function(response) {
				console.log(response);
			$scope.stateData = [{zone_id:'',name:'-- Select State --'}];
			$scope.stateData = $scope.stateData.concat(response.data);
	});
	}
	$scope.getData();
*/
	// $scope.stateData = [{zone_id:'',name:'-- Select State --'},
	// 	{zone_id:'1433',name:'Dubai'},
	// 	{zone_id:'1433',name:'Abu Dhabi'},
	// 	{zone_id:'1433',name:'Sharjah'},
	// 	{zone_id:'1433',name:'Ajman'},
	// 	{zone_id:'1433',name:'Fujairah'},
	// 	{zone_id:'1433',name:'Umm al-Quwain'},
	// 	{zone_id:'1433',name:'Ras Al Khaimah'}
	// ];


	$scope.iniRegister = {firstname:'', lastname:'',telephone:'',postcode:'',country_id:'',city:'',address_1:'',email:'',password:'',confirm:'',zone_id:'',agree:'1'};
	$scope.userRegister = function(form){
		if(form.$valid) {
				usersService.userRegister($scope.iniRegister)
				.then(function(response) {
					if(response.success){
						$location.path("app/dashboard");
					}else{
						 alertmsgService.showMessage('The email address already registered.');
					}
				}, function(error) {
					alertmsgService.tostMessage('An error occurred. Please try again.');
				});
		}

	}

	//---------------------------
	$scope.$watch("iniRegister.country_id",
			function handleFooChange( newValue, oldValue ) {
				if(newValue!='' && typeof(newValue)!='undefined'){
				//	$scope.iniRegister.zone_id = $scope.stateData[1].zone_id;
					console.log($scope.iniRegister);
					var country=$scope.iniRegister.country_id;
				//	console.log($scope.cuntryData);
                    angular.forEach($scope.cuntryData,function(key,value){
						console.log(key);
						if(key.country_id==country)
						{
							console.log(key.zone);
							$scope.stateData = [{zone_id:'',name:'-- Select State --'}];
			              $scope.stateData = $scope.stateData.concat(key.zone);
							//$scope.stateData=key.zone;
						}
						
					});

				}else{
					$scope.iniRegister.zone_id = '';
				}
			}
		);
	//---------------------------

})

.controller('IniLoginCtrl', function($scope,$rootScope,$location,usersService,alertmsgService,$ionicSideMenuDelegate,$ionicHistory) {
	'use strict';
	$ionicSideMenuDelegate.canDragContent(false); // hide sidemenu

	//-----------------------------
	$scope.isOpenEye = false;
	$scope.toggleEye = function(){
		if($scope.isOpenEye) $scope.isOpenEye=false; else $scope.isOpenEye=true;
	}
	//-----------------------------
	$scope.iniLogin = {email:'',password:''};
	$scope.userLogin = function(form){
		if(form.$valid) {
				usersService.userLogin($scope.iniLogin)
				.then(function(response) {
					if(response.success){
						$location.path("app/dashboard");
					}else{
						alertmsgService.tostMessage(response.error.warning);
					}
				}, function(error) {
					alertmsgService.tostMessage('An error occurred. Please try again.');
				});
		}
	}

	//-----------------------------
	$scope.iniReset = {email:''};
	$scope.userResetPassword = function(form){
		if(form.$valid) {
				usersService.userForgotten($scope.iniReset)
				.then(function(response) {
					if(response.success){
						$scope.iniReset = {email:''};
						alertmsgService.showMessage('New password has been sent to your registered email address.');
					}else{
						alertmsgService.tostMessage(response.error);
					}
				}, function(error) {
					alertmsgService.tostMessage(error);
				});
		}
	}


});
