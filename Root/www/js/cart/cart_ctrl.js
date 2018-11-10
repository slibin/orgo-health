angular.module('groceryworld.controllers')
.controller('CartCtrl', function($scope,$rootScope,$ionicLoading,$location,eCart,shoppingcartService,alertmsgService,$localStorage,ionicMaterialInk) {
	'use strict';

	$rootScope.isCartIconVisible = false;

	$rootScope.cartRefresh  = function(){;

		shoppingcartService.getCart()
		.then(function(response) {
			if(response.success){
				$scope.cartProducts = response.data.products;
				//console.log("$scope.cartProducts",$scope.cartProducts);
				angular.forEach(response.data.totals,function(subObj){
					$rootScope.cartTotal = 'Total : '+subObj.text;
				});

				$rootScope.cartItems = response.data.products.length;
			}else{
				$rootScope.cartItems = '';
				$scope.cartProducts = '';
			}
		}, function(error) {
			 alertmsgService.tostMessage(response.error);
		});
	}

	$rootScope.cartRefresh();

	//------------Update Qty-------------------------------
	$scope.updateQty	= function(prodObj,type){

		if(type=='add'){
			var newqty = parseInt(prodObj.quantity)+1;
			eCart.addInQty(prodObj);
		}else{
			var newqty = parseInt(prodObj.quantity)-1;
			eCart.minusInQty(prodObj);
		}

		//console.log(eCart.cartProducts);
		//console.log(eCart.isAvailable);

		if(newqty>0){

			if(eCart.isAvailable){
				shoppingcartService.updateCart({key:prodObj.key+"::",quantity:newqty})
					.then(function(response) {
					if(response.success){
						$rootScope.cartRefresh();
					}else{
						alertmsgService.tostMessage(response.error);
					}
				}, function(error) {
					alertmsgService.tostMessage(response.error);
				});
			}else{
				alertmsgService.showMessage("The product become out of the stock, you can not buy more quantity of this product.");
			}

		}else{
			$scope.removeProduct(prodObj);
		}
	}
	//----------Remove Item---------------------------------
	$scope.removeProduct= function(prodObj){


		eCart.removeProduct(prodObj);  // Remvoe from localcart

		//ostcartService.setRemove(prodObj);
		shoppingcartService.deletCartItem({key: prodObj.key})
			.then(function(response) {
			if(response.success){
				$rootScope.cartRefresh();
			}else{
				alertmsgService.tostMessage(response.error);
			}
		}, function(error) {
			alertmsgService.tostMessage(response.error);
		});

	}
	//--------------------------------------------
	$scope.deliveryAddress	= function(){
		if($rootScope.userData=='' || typeof($rootScope.userData)=='undefined'){
			$location.path("app/cart-userauth");
		}else{
			$location.path("app/delivery-address");
		}
	}

	//---------------------------------------------------
	$scope.showProductDetail	= function(proId){
		$location.path("app/products-detail/"+proId);
	}
	//-----------Set Default Ship Bill--------------------
	$localStorage.billingAddress ='';
	$localStorage.shippingAddress ='';
	$rootScope.shppingMethod = '';
	$rootScope.shppingMethodStore = '';
	$rootScope.paymentMethod = '';
	//---------------------------------------------------

	ionicMaterialInk.displayEffect();
})

.controller('CartUserauthCtrl', function($scope,$rootScope,$localStorage,$location,usersService,shoppingcartService,eCart,alertmsgService,ionicMaterialInk) {
	'use strict';
	$scope.stateData =[];
	usersService.getCountries()
	.then(function(response) {
		if(response.success){
			$scope.cuntryData = [{country_id:'',name:'-- Select Country --'}];
			$scope.cuntryData = $scope.cuntryData.concat(response.data);
		}
	});


	//------Verify Location-----------------
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
					alertmsgService.showMessage(response.message);
				}
		});
	}

	//------Register-----------------
/*	$scope.stateData = [{zone_id:'',name:'-- Select State --'},
		{zone_id:'1433',name:'Dubai'},
		{zone_id:'1433',name:'Abu Dhabi'},
		{zone_id:'1433',name:'Sharjah'},
		{zone_id:'1433',name:'Ajman'},
		{zone_id:'1433',name:'Fujairah'},
		{zone_id:'1433',name:'Umm al-Quwain'},
		{zone_id:'1433',name:'Ras Al Khaimah'}
	];
*/
	$scope.iniRegister = {firstname:'', lastname:'',telephone:'',postcode:'',country_id:'',city:'',address_1:'',email:'',password:'',confirm:'',zone_id:'',agree:'1'};
	$scope.userRegister = function(form){
		if(form.$valid) {
				usersService.userRegister($scope.iniRegister)
				.then(function(response) {
					if(response.success){
						$scope.getUserDetails();
						//$location.path("app/delivery-address");
					}else{
						alertmsgService.showMessage(response.error.warning);
					}
				}, function(error) {
					alertmsgService.tostMessage(error);
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
						console.log($scope.cuntryData);
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
	//--------Login---------------
	$scope.iniLogin = {email:'',password:''};
	$scope.userLogin = function(form){
		if(form.$valid) {
				usersService.userLogin($scope.iniLogin)
				.then(function(response) {
					if(response.success){
						$scope.getUserDetails();
					}else{
						alertmsgService.tostMessage(response.error.warning);
					}
				}, function(error) {
					alertmsgService.tostMessage(error);
				});
		}
	}

	//--------Forgot Pwd---------
	$scope.iniReset = {email:''};
	$scope.userResetPassword = function(form){
		if(form.$valid) {
				usersService.userForgotten($scope.iniReset)
				.then(function(response) {
					if(response.success){
						$scope.iniReset = {email:''};
						alertmsgService.showMessage('New password has been sent to your registered email address.');
					}else{
						$scope.iniReset.email='';
						alertmsgService.tostMessage(response.error);
					}
				}, function(error) {
					alertmsgService.tostMessage(error);
				});
		}
	}
	//--------Get User Info-------
	 $scope.getUserDetails = function(){
		usersService.userDetails()
		.then(function(response) {
			if(response.success){
				$rootScope.userData = response.data;
				$scope.replaceCart();
				console.log($rootScope.userData);
			}
		});
	 }
	//--------------------------
	$scope.replaceCart = function(){
		var newcartItem =[];
		 eCart.cartProducts.forEach(function(prod, index){
			if (prod.purchaseQuantity>0) {
				newcartItem.push({product_id:prod.id,quantity:prod.purchaseQuantity,option:''})
			}
		  });
		  $location.path("app/delivery-address");
	/*	shoppingcartService.emptyCart().then(function(response) {

			shoppingcartService.addBulkCart(newcartItem)
			.then(function(response) {
				 if(response.success){
					 $location.path("app/delivery-address");
				 }else{
					 alertmsgService.tostMessage(response.error);
				 }
			}, function(error) {
				 alertmsgService.tostMessage(response.error);
			});

		}); */

	}

	//--------------------------

	ionicMaterialInk.displayEffect();
})

.controller('CartDeliveryCtrl', function($scope,$rootScope,$ionicModal,$location,usersService,shoppingcartService,alertmsgService,$localStorage,$timeout,ionicMaterialInk) {
	'use strict';

	//------------------------------------
	$rootScope.billingAddress = '';
	$rootScope.shipingAddress = '';
	$scope.getBillShipAddress = function(){

		shoppingcartService.getBillShipAddress()
		.then(function(response) {
			//console.log(response);
			if(response.success){
				$scope.billAddresses	= response.data.addresses;
				$scope.shipAddresses	= response.data.addresses;
			}else{
				$scope.billAddresses = [];
				$scope.shipAddresses = [];
			}
		}, function(error) {
			alertmsgService.tostMessage(error);
		});
	}

	$scope.getBillShipAddress();
	//------------Address Modal----------------------
	$scope.billshipAddress = {firstname:'', lastname:'',country_id:'',address_1:'',city:'',postcode:'',zone_id:'1433'};

	$ionicModal.fromTemplateUrl('js/cart/add-address.html', { scope: $scope })
	.then(function(modal) { $scope.addressModal = modal; });
	$scope.AddressClose = function() { $scope.addressModal.hide(); };
	$scope.addAddress = function() {

		$scope.cuntryData = [{country_id:'',name:'-- Select Country --'}];
		usersService.getCountries()
		.then(function(response) {
			if(response.success){
				$scope.cuntryData = $scope.cuntryData.concat(response.data);
			}
		});

		//--- States loading service ---
		usersService.getStates()
		.then(function(response) {
					console.log(response);
				$scope.cityData = [{city:'',name:'-- Select State --'}];
				$scope.cityData = $scope.cityData.concat(response.data);
		});

		$scope.billshipAddress = {firstname:'', lastname:'',country_id:'',address_1:'',city:'',postcode:'',zone_id:'1433'};

		$scope.addressModal.show();
	};


	$scope.$watch("billshipAddress.country_id",
			function handleFooChange( newValue, oldValue ) {
				// if(newValue!='' && typeof(newValue)!='undefined'){
				// 	$scope.billshipAddress.city = $scope.cityData[1].city;
				// }else{
				// 	$scope.billshipAddress.city = '';
				// }
				if(newValue!='' && typeof(newValue)!='undefined'){
					//	$scope.iniRegister.zone_id = $scope.stateData[1].zone_id;
						console.log($scope.billshipAddress);
						var country=$scope.billshipAddress.country_id;
						console.log($scope.cuntryData);
						angular.forEach($scope.cuntryData,function(key,value){
							console.log(key);
							
							if(key.country_id==country)
							{
								console.log(key.zone);
								$scope.cityData = [{city:'',name:'-- Select State --'}];
							  $scope.cityData = $scope.cityData.concat(key.zone);
								//$scope.stateData=key.zone;
							}
							
						});
	
					}else{
						$scope.billshipAddress.city = '';
					}
			}
		);

		
	//-----------Remvoe Address-----------------------
	$scope.removeAddress = function(address_id){
		if($localStorage.billingAddress == address_id )
		{
				$rootScope.billingAddress	 = '';
				$localStorage.billingAddress = '';
		}
		usersService.removeAddress(address_id)
		.then(function(response) {
			if(response.success){
				$scope.getBillShipAddress();
			}
		});
	}
	//-----------Add Billing Address-----------------------
	$scope.saveAddress = function(form){
		if(form.$valid) { $scope.saveBillingAddress($scope.billshipAddress); }
	}

	$scope.saveBillingAddress = function(data,stype){
		shoppingcartService.addBillingAddress(data)
		.then(function(response) {
			if(response.success){
				if(typeof(stype)=='undefined'){ $scope.getBillShipAddress(); $scope.addressModal.hide(); }
			}else{
				alertmsgService.showMessage(response.error);
			}
		});
	}

	$scope.saveShippingAddress = function(data,stype){
		shoppingcartService.addShippingAddress(data)
		.then(function(response) {
			console.log(response);
			if(response.success){
				if(typeof(stype)=='undefined'){ $scope.addressModal.hide();	$scope.getBillShipAddress(); }
			}else{
				alertmsgService.showMessage(response.error);
			}
		});
	}
	//-------Set In Local Storage---------------------------
		$rootScope.billingAddress  = $localStorage.billingAddress;
		$rootScope.shippingAddress = $localStorage.shippingAddress;
	//----------------------------------
	$scope.selectBillAddress = function(value) {
		    console.log(value);
			$rootScope.billingAddress = value;
			$localStorage.billingAddress = value;
			var tmpdata = {payment_address:"existing",address_id:value}
			$scope.saveBillingAddress(tmpdata,'set');
			$timeout(function() { $scope.selectShipAddress(value);   }, 1000); //
	};
	//----------------------------------
	$scope.selectShipAddress = function(value) {
			    console.log(value);
			$rootScope.shippingAddress = value;
			$localStorage.shippingAddress = value;
			var tmpdata = {shipping_address:"existing",address_id:value}
			$scope.saveShippingAddress(tmpdata,'set');
	};
	//----------------------------------
	$scope.deliveryOptions = function(){
		  if($rootScope.billingAddress==''){
			alertmsgService.showMessage('Select Shipping Address.');
		  }else{
			//$location.path("app/shipping-address");
			$location.path("app/delivery-options");
		  }
	 }
	 $scope.shippingOptions = function(){
		  if($rootScope.shippingAddress==''){
			 alertmsgService.showMessage('Select Shipping Address.');
		  }else{
			$location.path("app/delivery-options");
		  }
	 }
	//----------------------------------

	ionicMaterialInk.displayEffect();
})






.controller('CartOptionsCtrl', function($scope,$rootScope,ionicDatePicker,$ionicModal,$location,shoppingcartService,alertmsgService,ionicMaterialInk) {
'use strict';


	if(typeof($rootScope.shppingMethod)=='undefined') $rootScope.shppingMethod = '';
	$scope.selectShipMethod = function(data){
		$rootScope.shppingMethod = data;
	}
	if(typeof($rootScope.shppingMethodStore)=='undefined') $rootScope.shppingMethodStore = '';
	$scope.selectStore = function(data){
		$rootScope.shppingMethodStore = data;
	}


	shoppingcartService.getShippingMethods()
	.then(function(response) {
		//console.log(response.data.shipping_methods.toSource());
		//console.log(response.data.shipping_methods);
		//console.log(response);
		if(response.success){
			$scope.shippingData = response.data;
			console.log("$scope.shippingData",$scope.shippingData);
			//-----Set Free shipping if order is grater >= 1000--------
			//var tmpArray = $scope.cartTotal.split(">");
			//var price = parseInt(tmpArray[2].replace(/,/g, ''));
			//if(price>=1000)	$scope.selectShipMethod('free.free');
			//--------------------------------------------------------
		}
	});


	//-------------DatePicker---------------------
	var dateOption ='';
	$scope.getDeliveryTime = function(dtime){

		shoppingcartService.getDeliveryTime({added_date:dtime})
		.then(function(response) {
			if(response.success){
				$scope.availableDTime = [];

				//$scope.availableDTime = [{date:'-- Select Delivery Time --',value:''}];
				angular.forEach(response.delivery_times,function(subObj){
						var tmpdata = {date:subObj.date,value:subObj.date};
						$scope.availableDTime.push(tmpdata);
				});
				//$rootScope.deliveryTime = $scope.availableDTime[0].value;
				$scope.storeData = response.stores;
			}else{
				var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
				var tomorrowTimestramp = tomorrow.getTime()/1000;
				$rootScope.deliveryDate = tomorrow.getDate()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getFullYear();
				$scope.getDeliveryTime(tomorrowTimestramp);
			}
		});
	}
	//---------------------------------
	var newCDate	= new Date();
	var nextMonth	= newCDate.getMonth()+1;
	var monthEnd	= new Date(newCDate.getFullYear(), nextMonth+1, 0).getDate();

	//-----------Check Current Time----------
	var cdate = new Date();
	var maxDTime = new Date(cdate.getFullYear(), cdate.getMonth(), cdate.getDate(), 17, 0, 0, 0),   maxDTime = maxDTime.getTime();
    var currentDTime = getISTTime();

    if(typeof($rootScope.deliveryDate)=='undefined' || $rootScope.deliveryDate==''){
		if(currentDTime > maxDTime){
			var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			var tomorrowTimestramp = tomorrow.getTime()/1000;
			$rootScope.deliveryDate = tomorrow.getDate()+"-"+(tomorrow.getMonth()+1)+"-"+tomorrow.getFullYear();
			$scope.getDeliveryTime(tomorrowTimestramp);
			var availableDate= tomorrow;
		}else{
			$rootScope.deliveryDate = cdate.getDate()+"-"+(cdate.getMonth()+1)+"-"+cdate.getFullYear();
			var dateInNumber = cdate.getTime()/1000; // Delivery Available
			$scope.getDeliveryTime(dateInNumber);
			var availableDate= cdate;
		}
	}else{
		if(currentDTime > maxDTime){
			var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			var availableDate= tomorrow;
		}else{
			var availableDate= cdate;
		}
		$scope.getDeliveryTime($rootScope.tmpSDate);
	}
   //----------------------------------
	dateOption = {
	  callback: function (val) {  //Mandatory
		 $rootScope.deliveryTime='';
		var sDate = new Date(val);
		$rootScope.deliveryDate = sDate.getDate()+"-"+(sDate.getMonth()+1)+"-"+sDate.getFullYear();

		var newtime = val/1000;
		$rootScope.tmpSDate = newtime;
		$scope.getDeliveryTime(newtime);
	  },
	  from: availableDate, //Optional
	  //to: new Date(newCDate.getFullYear(), nextMonth, monthEnd), //Optional
	 to: new Date(newCDate.getFullYear(), nextMonth, monthEnd), //Optional
	  inputDate:availableDate,      //Optional
	  mondayFirst: true,          //Optional
	  dateFormat: 'dd MMMM yyyy',
	  //disableWeekdays: [0],       //Optional
	  closeOnSelect: true,       //Optional
	  templateType: 'popup'       //Optional
	};


	$scope.openDatePicker = function(){  ionicDatePicker.openDatePicker(dateOption);  };
	//----------------------------------
	if(typeof($rootScope.deliveryTime)=='undefined' || $rootScope.deliveryTime=='')$rootScope.deliveryTime = '';
	$scope.selectedDeliveryTime = function(data){ $rootScope.deliveryTime=data; }
	//----------------------------------
		$scope.placeOrder	= function(){
			if($rootScope.shppingMethod=='' && $scope.deliveryTime=='' && $rootScope.shppingMethodStore == ''){
				alertmsgService.showMessage("Select shipping method , Store to deliver and delivery date time to proceed.")
			}else if($rootScope.shppingMethod=='' && $scope.deliveryTime!='' && $rootScope.shppingMethodStore !=''){
				alertmsgService.showMessage("Select shipping method to proceed.");
			}else if($rootScope.shppingMethod=='' && $scope.deliveryTime=='' && $rootScope.shppingMethodStore !=''){
				alertmsgService.showMessage("Select shipping method to proceed and date time.");
			}else if($rootScope.shppingMethod!='' && $scope.deliveryTime=='' && $rootScope.shppingMethodStore !=''){
				alertmsgService.showMessage("Select date and time to proceed.");
			}else if($rootScope.shppingMethod!='' && $scope.deliveryTime=='' && $rootScope.shppingMethodStore == ''){
				alertmsgService.showMessage("Select Store and delivery date time to proceed.");
			}else if($rootScope.shppingMethod=='' && $scope.deliveryTime!='' && $rootScope.shppingMethodStore == ''){
				alertmsgService.showMessage("Select Shipping method and Store to proceed.");
			}else if($rootScope.shppingMethod!='' && $scope.deliveryTime!='' && $rootScope.shppingMethodStore == ''){
				alertmsgService.showMessage("Select store to proceed.");
			}else{
				var ship = {shipping_method:$rootScope.shppingMethod,comment: "Selected Shipping method"};
				//console.log(ship);
				shoppingcartService.addShippingMethods(ship)
				.then(function(response) {
					//console.log(response);
					if(response.success){
						$scope.getCartData();
						$location.path("app/place-order");
					}else{
						alertmsgService.showMessage(response.error.warning);
					}
				});
			}

	}
	//----------------------------------

ionicMaterialInk.displayEffect();
})

.controller('CartOrderCtrl', function($scope,$rootScope,$ionicModal,$location,$interval,$localStorage,shoppingcartService,$cordovaInAppBrowser,alertmsgService,ionicMaterialInk,PAYPAL_API) {
'use strict';

	console.log("$rootScope.shppingMethodStore",$rootScope.shppingMethodStore);
		shoppingcartService.getPaymentMethods()
		.then(function(response) {
			console.log("payment option",response);
			if(response.success){
				$scope.paymentOptions = response.data;
				$localStorage.paymentOptions = $scope.paymentOptions;
			}
		}, function(error) {
			 if(typeof($localStorage.paymentOptions)=='undefined'){
				$scope.paymentOptions = {cod:{code:"cod", title:"Cash On Delivery", terms:"", sort_order:"4"}};
			 }else{
				$scope.paymentOptions = $localStorage.paymentOptions;
			 }
		});


		//----------------------------------------
		 $scope.discountData = {coupon:''};
		 $scope.getCouponDiscount = function(form){
			 if(form.$valid && $scope.discountData.coupon!='') {
				shoppingcartService.discountOnCoupon($scope.discountData)
				.then(function(response) {
					//console.log(response);
					if(response.success){
						$scope.discountData = {coupon:''};
						$scope.getCartData();
					}else{
						alertmsgService.showMessage(response.error.warning);
						$scope.discountData = {coupon:''};
					}
				}, function(error) {
					 alertmsgService.showMessage(error);
					 $scope.discountData = {coupon:''};
				});
			 }else{
				alertmsgService.showMessage("Please Enter Coupon Code");
			 }
		 }
		//------------Select Payment method----------------------------
		if(typeof($rootScope.paymentMethod)=='undefined') $rootScope.paymentMethod ='';

		$scope.selectPaymentMethod = function(obj){
			var deliveryDateTime = $rootScope.deliveryDate+" "+$rootScope.deliveryTime;
			var paymentdata = {payment_method:obj.code,agree:"1",comment: deliveryDateTime,storeID:$rootScope.shppingMethodStore}
			shoppingcartService.addPaymentMethods(paymentdata)
			.then(function(response) {
				console.log("addPaymentMethods",response);
				if(response.success){
					$rootScope.paymentMethod = obj.code;
				}else{
					$rootScope.paymentMethod = '';
				}
			}, function(error) {
				alertmsgService.tostMessage(error);
				$rootScope.paymentMethod = '';
			});

		}
		//----------------------------------------
		$scope.orderConfirm = function(){
			if($rootScope.paymentMethod==''){
				alertmsgService.showMessage("Please Select Payment Method.");
			}else{
				shoppingcartService.orderConfirm()
				.then(function(response) {
					console.log("orderConfirm",response);
					if(response.success){
						if($rootScope.paymentMethod=='cod'){
							//$scope.codPayment();
							$location.path("app/order-status/"+response.data.order_id+"/cod");
						}else{
						 	//$scope.oid = response.data.order_id;
						 	//$scope.makePayment($rootScope.paymentMethod);
							$location.path("app/order-status/"+response.data.order_id+"/"+$rootScope.paymentMethod);
						}

					}else{
						$scope.oid = '';
						alertmsgService.showMessage("Unable to place order. Please try again.");
					}
				}, function(error) {
					alertmsgService.tostMessage(error);
				});
			}
		}
		//-----------------------------------------
		/*$scope.codPayment = function(){
			shoppingcartService.paymentStatus()
			.then(function(response) {
				if(response.success){
					$location.path("app/order-status/1");
				}else{
				}
			}, function(error) {
				 alertmsgService.tostMessage(error);
			});
		}*/
		// //-----------Payment Gateway---------------------------------------
		// var stop = null;
		// $scope.makePayment = function(){
		// 	if($rootScope.paymentMethod == 'pp_standard'){
		// 		var payment_API = PAYPAL_API;
		// 	}else{
		// 		var payment_API = SECURE_SUBMIT_API;
		// 	}
		// 	var options = {location: 'no',clearcache: 'yes',toolbar: 'no'};
		// 	$cordovaInAppBrowser.open(payment_API+$scope.oid, '_blank', options)
		// 	  .then(function(event) {
		// 		// success
		// 		stop = $interval(function() {	 $scope.checkPaymentStatus($scope.oid);  }, 3000);
		// 	  })
		// 	  .catch(function(event) {
		// 		// error
		// 	  });
		// }
		//
		// $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
		// 		$interval.cancel(stop);
		// 		if($scope.order_paystatus==''){
		// 			 $location.path("app/order-status/3");
		// 		}else{
		// 			if($scope.order_paystatus=='Complete') $location.path("app/order-status/1");
		// 			if($scope.order_paystatus=='Failed') $location.path("app/order-status/2");
		// 			if($scope.order_paystatus=='Canceled') $location.path("app/order-status/3");
		// 		}
		// });
		//----------------Check Order Status-------------------------
		 /*$scope.order_paystatus = '';
		  $scope.checkPaymentStatus = function(){
				shoppingcartService.getOrderStatus($scope.oid)
				.then(function(response) {
					if(response.success){
						$scope.order_paystatus = response.data.status;
						$cordovaInAppBrowser.close();
					}
				}, function(error) {
					$cordovaInAppBrowser.close();
					alertmsgService.tostMessage(error);
				});
		  }*/
		//-------------------------------------------------------

})

.controller('CartOrderStatusCtrl', function($scope,$rootScope,$stateParams,shoppingcartService,$ionicPopup,$ionicPlatform,$interval,PAYPAL_API,SECURE_SUBMIT_API,$sce,ionicMaterialInk,$cordovaInAppBrowser,$timeout) {
'use strict';
		$scope.order_fstatus = '';
		$scope.order_type	= $stateParams.otype;
		$scope.order_id		= $stateParams.oid;

		if($scope.order_type!='cod'){
			// //-----------Payment Gateway---------------------------------------
			var stop = null;
			stop = $interval(function() {	 $scope.checkPaymentStatus($scope.order_id);  }, 15000);
			if($scope.order_type == 'pp_standard'){
				var payment_API = PAYPAL_API;
			}else{
				var payment_API = SECURE_SUBMIT_API;
			}
			var options = {location: 'no',clearcache: 'yes',toolbar: 'no'};
			$cordovaInAppBrowser.open(payment_API+$scope.order_id+'&storeID='+$rootScope.shppingMethodStore, '_blank', options)
			  .then(function(event) {
				// success
				stop = $interval(function() {	 $scope.checkPaymentStatus($scope.order_id);  }, 15000);
			  })
			  .catch(function(event) {
				// error
				$cordovaInAppBrowser.close();
			  });


			$rootScope.$on('$cordovaInAppBrowser:exit', function(e, event){
				//console.log('IN app browser closed');
					// $interval.cancel(stop);
					// if($scope.order_paystatus==''){
					// 	 $location.path("app/order-status/3");
					// }else{
					// 	if($scope.order_paystatus=='Complete') $location.path("app/order-status/1");
					// 	if($scope.order_paystatus=='Failed') $location.path("app/order-status/2");
					// 	if($scope.order_paystatus=='Canceled') $location.path("app/order-status/3");
					// }
					if(typeof($scope.order_fstatus)!='undefined' && $scope.order_fstatus<=1){
						$scope.order_fstatus = 3;
						$interval.cancel(stop);
					}else{
						$interval.cancel(stop);
					}
					$timeout(function () {	$cordovaInAppBrowser.close();	}, 500);
			});

			//----------------Check Order Status-------------------------
			 $scope.order_paystatus = '';
			 $scope.order_fstatus = '';
 			  $scope.checkPaymentStatus = function(){
					shoppingcartService.getOrderStatus($scope.order_id)
					.then(function(response) {
						if(response.success){
							//$interval.cancel(stop);
							$scope.isPayment = false;
							$scope.isCancelBox = false;
							if(response.data.status=='Complete') $scope.order_fstatus = 1;
							if(response.data.status=='Failed') $scope.order_fstatus = 2;
							if(response.data.status=='Canceled') $scope.order_fstatus = 3;
							if(response.data.status=='Processing') $scope.order_fstatus = 1;

							if($scope.order_fstatus != ''){
								$interval.cancel(stop);
								$cordovaInAppBrowser.close();

							}
							//$scope.emptyCart();
						}
					}, function(error) {
						$interval.cancel(stop);
						$scope.isPayment = false;
						$scope.isCancelBox = false;
						$scope.order_fstatus = 2;
					});
			  }
			//-------------------Order Cancel Popup--------------------
				$scope.isCancelBox = true;
				$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
					if(toState.name=='app.order-status'){
						$scope.isCancelBox = true;
					}else{
						$scope.isCancelBox = false;
					}
				});

				$ionicPlatform.registerBackButtonAction(function(e) {
					if($scope.isCancelBox){
						e.preventDefault();
						$scope.cancelProcess();
					}
				}, 101);
			//-------------------------------------------------------

		}else{
			//Cahse on delivery
			$scope.isPayment = false;
			shoppingcartService.paymentStatus()
			.then(function(response) {
				if(response.success){
					$scope.emptyCart();
				}else{
					$scope.order_fstatus = 2;
				}
			}, function(error) {
				 alertmsgService.tostMessage(error);
			});

		}

	//-----------------------
	$scope.emptyCart = function(){
		shoppingcartService.emptyCart().then(function(response) {
				$scope.order_fstatus = 1;
				$rootScope.cartItems = ''; // Empty Cart items.
		});
	}
	//-----------------------

	//--------------------------------------

		$scope.checkOrderSuccessPage = function(){
			$ionicPlatform.registerBackButtonAction(function(e) {
				if($scope.isOrderSuccess){
						e.preventDefault();
						$location.path("app/dashboard");
				}else {
						$ionicHistory.goBack();
				}
			}, 101);
		}
		$scope.isOrderSuccess = true;
		$scope.checkOrderSuccessPage();
	//----------------------------------------

ionicMaterialInk.displayEffect();
});
