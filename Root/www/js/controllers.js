angular.module('groceryworld.controllers', ['ionic', 'ngCordova','ionic-datepicker'])

.controller('AppCtrl', function($scope,$rootScope,$filter,$state,$location,usersService,$ionicModal,$localStorage,$cordovaDialogs,$cordovaPush,$ionicSideMenuDelegate,$cordovaInAppBrowser, categoryService,shoppingcartService,dashboardService,alertmsgService, ionicMaterialInk) {

	$ionicSideMenuDelegate.canDragContent(true); // hide sidemenu

	//---------------------
	 $scope.getCartData = function(){
		 shoppingcartService.getCart()
		.then(function(response) {
			if(response.success){
				$rootScope.cartItems = response.data.products.length;
				$rootScope.cartTotalList = response.data.totals;
				angular.forEach(response.data.totals,function(subObj){	$rootScope.cartTotal = 'Total : '+subObj.text;  });
			}else{
				$localStorage.ostCart = [];
			}
		}, function(error) {
			 alertmsgService.tostMessage(response.error);
		});
	 }

	//---------------------
	if($rootScope.userData=='' || typeof($rootScope.userData)=='undefined'){
		usersService.userDetails()
		.then(function(response) {
			if(response.success){
				$rootScope.userData = response.data;
			}else{
				$rootScope.userData='';
			}
		});
	}
	//---------------------
	$rootScope.isCatMenu = true;
	 $scope.toggleMemuLiks = function(){
		if($rootScope.isCatMenu) $rootScope.isCatMenu = false; else $rootScope.isCatMenu=true;
	 }
	//---------------------
	$ionicModal.fromTemplateUrl('js/products/products-search.html', { scope: $scope })
	.then(function(modal) { $scope.searchModal = modal; });
	$scope.searchClose = function() { $scope.searchModal.hide(); };
	$scope.searchShow = function() {
		$scope.searchModal.show();
	};

	$scope.popularSearch = [{heading:'Popular Search',items:[{id:0,title:'Cakes & Croissants'},{id:0,title:'Soft Drinks'},{id:0,title:'Maggi'},{id:0,title:'Atta'},{id:0,title:'Desi Ghee'}]}];

	$scope.getSearchResult = function(keywords){
	    $scope.searchKeyword = keywords;
		$scope.searchCats = $filter('filter')($scope.searchDefaultCats, { title: keywords });
		if($scope.searchCats=='') $scope.searchCats = '';
	}
	$scope.resetSearch = function(keywords){ $scope.searchCats = '';	}
	$scope.searchProduct = function(cat_id,title){
		if(typeof(cat_id)=='undefined') cat_id = 0;
		if(typeof(title)=='undefined') title = $scope.searchKeyword;

		if(typeof(cat_id)!='undefined' && typeof(title)!='undefined'){
			$scope.searchModal.hide();
			$location.path("app/search/"+cat_id+"/"+title.replace("&amp;","and"));
		}
	}
	//---------------------


	$rootScope.accordionConfig = {
		debug: false, //For developing
		animDur: 300, //Animations duration minvalue is 0
		expandFirst: false, //Auto expand first item
		autoCollapse: true, //Auto collapse item flag
		watchInternalChanges: false, //watch internal attrs of the collection (false if not needed)
		headerClass: '', //Adding extra class for the headers
		beforeHeader: '', //Adding code or text before all the headers inner content
		afterHeader: '', //Adding code or text after all the headers inner content
		topContentClass: '', //Adding extra class for topContent
		beforeTopContent: '', //Adding code or text before all the topContent if present on item
		afterTopContent: '', //Adding code or text after all the topContent if present on item
		bottomContentClass: '', //Adding extra class for topContent
		beforeBottomContent: '', //Adding code or text before all the topContent if present on item
		afterBottomContent: '', //Adding code or text before all the topContent if present on item
		menuLink: '#/app/products' //Adding code or text before all the topContent if present on item
	};


	//$scope.searchProduct = function(){ $state.go('app.search'); }


	$scope.viewCart = function(){ $state.go('app.shopping-cart'); }

	$scope.toggleLeftSideMenu = function() { $rootScope.isCatMenu = true; $ionicSideMenuDelegate.toggleLeft();  };

	$scope.logout = function() {
			usersService.userLogout()
			.then(function(response) {
				if(response.success){
					$rootScope.userData = '';
					$rootScope.cartItems = '';
					$location.path('app/dashboard');
				}
			}, function(error) {
				alertmsgService.tostMessage(error);
				$location.path('app/iniscreen');
			});
	};

	//-----------------------------------------------------------
	$scope.openExternalLink = function(wlink){
		var options = {location: 'yes',clearcache: 'yes', toolbar: 'no'};
		$cordovaInAppBrowser.open(wlink, '_system', options)
		.then(function(event) { })
		.catch(function(event) { });
	}
	//-----------------------------------------------------------
//=========================Push Notification========================================

	   // call to register automatically upon device ready
	   /* document.addEventListener("deviceready", function () {
			if(typeof($localStorage.isDeviceRegistered)=='undefined'){
				//$scope.registerDevice();
			}
		});*/

	   // Register Device
		$scope.registerDevice = function () {
			var config = null;


			if (ionic.Platform.isAndroid()) {
				config = {"senderID": "681378074558"}; /*REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: */
			}
			else if (ionic.Platform.isIOS()) {
				config = {
					"badge": "true",
					"sound": "true",
					"alert": "true"
				}
			}

			$cordovaPush.register(config).then(function (result) {
				/*NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here*/
				if (ionic.Platform.isIOS()) {	$scope.regId = result;	storeDeviceToken("ios");	}
			}, function (err) {
				console.log("Register error " + err)
			});
		}

		 // Notification Received
		$scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
			//console.log(JSON.stringify([notification]));
			if (ionic.Platform.isAndroid()) {
				handleAndroid(notification);
			}
			else if (ionic.Platform.isIOS()) {
				handleIOS(notification);
				//$scope.$apply(function () {	$scope.notifications.push(JSON.stringify(notification.alert));	})
			}
		});

		// Android Notification Received Handler
		function handleAndroid(notification) {
			/* NOTE: ** You could add code for when app is in foreground or not, or coming from coldstart here too */

			//console.log("In foreground " + notification.foreground  + " Coldstart " + notification.coldstart);
			if (notification.event == "registered") {
				$scope.regId = notification.regid;
				storeDeviceToken("android");
			}
			else if (notification.event == "message") {
				//$cordovaDialogs.alert(notification.message, "Push Notification Received");
				//$scope.$apply(function () {	$scope.notifications.push(JSON.stringify(notification.message)); })
			}
			else if (notification.event == "error"){
				$cordovaDialogs.alert(notification.msg, "Push notification error event");
			}else{
				$cordovaDialogs.alert(notification.event, "Push notification handler - Unprocessed Event");
			}
		}

		// IOS Notification Received Handler
		function handleIOS(notification) {
			// The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
			// for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
			// the notification when this code runs (weird).
			if (notification.foreground == "1") {
				// Play custom audio if a sound specified.
				if (notification.sound) {
					var mediaSrc = $cordovaMedia.newMedia(notification.sound);
					mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
				}

				if (notification.body && notification.messageFrom) {
					$cordovaDialogs.alert(notification.body, notification.messageFrom);
				}
				else $cordovaDialogs.alert(notification.alert, "Push Notification Received");

				if (notification.badge) {
					$cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
						console.log("Set badge success " + result)
					}, function (err) {
						console.log("Set badge error " + err)
					});
				}
			}
			// Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
			// in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
			// the data in this situation.
			else {
				if (notification.body && notification.messageFrom) {
					$cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
				}
				else $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
			}
		}

		// Stores the device token in a db using node-pushserver (running locally in this case)
		// type:  Platform type (ios, android etc)
		function storeDeviceToken(type) {

			// Create a random userid to store with it
			var userdata = {device_id: Math.floor((Math.random() * 10000000) + 1), device_type:type, access_token:$scope.regId};
			//var userdata = { device_id: 'user' + Math.floor((Math.random() * 10000000) + 1), access_token:$scope.regId };
			 dashboardService.storeDeviceToken(userdata)
			.then(function(response) {
				if(response.success){
					$localStorage.isDeviceRegistered = true;
				}else{

				}
			}, function(error) {
				 alertmsgService.tostMessage(response.error);
			});

		}

//==================================================================================
  ionicMaterialInk.displayEffect();
})
