// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('groceryworld', ['ionic',
'groceryworld.controllers',
'groceryworld.directives',
'groceryworld.services',
'groceryworld.config',
'ionic-material',
'sir-accordion',
'ionicLazyLoad',
'ionicShop',
'ngMessages',
'ngStorage',
'ngSanitize'
])

.run(function($ionicPlatform,$rootScope,$ionicPopup,$cordovaToast,$timeout,$cordovaSplashscreen) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

	 $rootScope.CSIGN = '$';

	 document.addEventListener("deviceready", function () {
		 $cordovaSplashscreen.hide();
		$timeout(function() { $cordovaSplashscreen.hide();   }, 1000); //
	 }, false);
	//----------------------
	if($rootScope.userData=='')$rootScope.isCartIconVisible = false;
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		if(toState.name=='app.dashboard' || toState.name=='app.products' || toState.name=='app.products-detail' || toState.name=='app.filter' || toState.name=='app.search' ){
      $rootScope.isCartIconVisible = true;
    
		}else{
      $rootScope.isCartIconVisible = false;
  
		}
		if(toState.name=='app.dashboard') $rootScope.backToProduct = '';
	});
	//----------------------
		$rootScope.tostMsg = function(msg){
			$cordovaToast
			.showShortTop(msg)
			.then(function(success) {
				// success
			}, function (error) {
				// error
			});
		}
	//----------------------
	 $rootScope.showAlert = function(msg) {
		 $ionicPopup.alert({
				title: 'Information', template: msg,
				buttons: [ { text: 'OK',type: 'button-balanced', } ]
			 });
		 };

	//----------------------
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

 $ionicConfigProvider.navBar.alignTitle('center'); // Align title center
 $ionicConfigProvider.views.transition('none');
 //--This has been added for the ios device goes blank issue----
 $ionicConfigProvider.views.swipeBackEnabled(false);
 //$ionicConfigProvider.tabs.position('bottom'); 

  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.connection', {
    url: '/connection',
    views: {
      'menuContent': {
        templateUrl: 'js/connection/connection.html',
		controller: 'ConnectionCtrl'
      }
    }
  })

  .state('app.iniscreen', {
    url: '/iniscreen',
    views: {
      'menuContent': {
        templateUrl: 'js/iniscreen/iniscreen.html',
		controller: 'IniscreenCtrl'
      }
    }
  })

  .state('app.select-location', {
    url: '/select-location',
    views: {
      'menuContent': {
        templateUrl: 'js/iniscreen/select-location.html',
		controller: 'IniLocationCtrl'
      }
    }
  })

  .state('app.inisignup', {
    url: '/inisignup',
    views: {
      'menuContent': {
        templateUrl: 'js/iniscreen/inisignup.html',
		controller: 'IniSignupCtrl'
      }
    }
  })

 .state('app.inilogin', {
    url: '/inilogin',
    views: {
      'menuContent': {
        templateUrl: 'js/iniscreen/inilogin.html',
		controller: 'IniLoginCtrl'
      }
    }
  })
//-----------------
  .state('app.dashboard', {
    cache:false,
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'js/dashboard/dashboard.html',
		controller: 'DashboardCtrl'
      }
    }
  })

 .state('app.products', {
   cache:false,
    url: '/products/:catid',
    views: {
      'menuContent': {
        templateUrl: 'js/products/products.html',
        controller: 'ProductsCtrl'
      }
    }
  })

 .state('app.search', {
    url: '/search/:catid/:catname',
    views: {
      'menuContent': {
        templateUrl: 'js/products/products.html',
        controller: 'ProductsCtrl'
      }
    }
  })

 .state('app.products-detail', {
	cache:false,
    url: '/products-detail/:proid',
    views: {
      'menuContent': {
        templateUrl: 'js/products/products-detail.html',
        controller: 'ProductsDetailCtrl'
      }
    }
  })

 .state('app.filter', {
    url: '/filter/:catid',
    views: {
      'menuContent': {
        templateUrl: 'js/products/products-filter.html',
        controller: 'ProductsFilterCtrl'
      }
    }
  })


//-----------------
 .state('app.shopping-cart', {
	cache:false,
    url: '/shopping-cart',
    views: {
      'menuContent': {
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl'
      }
    }
  })

 .state('app.delivery-address', {
	cache:false,
    url: '/delivery-address',
    views: {
      'menuContent': {
        templateUrl: 'js/cart/delivery-address.html',
        controller: 'CartDeliveryCtrl'
      }
    }
  })

.state('app.shipping-address', {
    cache:false,
     url: '/shipping-address',
     views: {
       'menuContent': {
         templateUrl: 'js/cart/shipping-address.html',
         controller: 'CartDeliveryCtrl'
       }
     }
   })

 .state('app.cart-userauth', {
	cache:false,
    url: '/cart-userauth',
    views: {
      'menuContent': {
        templateUrl: 'js/cart/cart-userauth.html',
        controller: 'CartUserauthCtrl'
      }
    }
  })

  .state('app.delivery-options', {
	cache:false,
    url: '/delivery-options',
    views: {
      'menuContent': {
        templateUrl: 'js/cart/delivery-options.html',
        controller: 'CartOptionsCtrl'
      }
    }
  })

.state('app.place-order', {
	cache:false,
    url: '/place-order',
    views: {
      'menuContent': {
        templateUrl: 'js/cart/place-order.html',
        controller: 'CartOrderCtrl'
      }
    }
  })

.state('app.order-status', {
	cache:false,
    url: '/order-status/:oid/:otype',
    views: {
      'menuContent': {
        templateUrl: 'js/cart/order-status.html',
        controller: 'CartOrderStatusCtrl'
      }
    }
  })
//-----------------
 .state('app.changepwd', {
	cache:false,
    url: '/changepwd',
    views: {
      'menuContent': {
        templateUrl: 'js/profile/changepwd.html',
        controller: 'ChagnepwdCtrl'
      }
    }
  })

 .state('app.orders', {
	cache:false,
    url: '/orders',
    views: {
      'menuContent': {
        templateUrl: 'js/orders/orders.html',
        controller: 'OrdersCtrl'
      }
    }
  })


  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'js/profile/profile.html',
		controller: 'ProfileCtrl'
      }
    }
  })
  .state('app.contact', {
    url: '/contact',
    views: {
      'menuContent': {
        templateUrl: 'js/profile/contact.html',
		controller: 'ContactCtrl'
      }
    }
  })
  .state('app.offer', {
    url: '/offer',
    views: {
      'menuContent': {
        templateUrl: 'js/profile/offer.html',
		controller: 'OfferCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/connection');
})

.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
              $rootScope.hideTabs = '';
          });
      }
  };
});