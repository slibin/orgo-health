angular.module('groceryworld.services')
.factory('ostcartService', function($localStorage,$rootScope) {
  'use strict';

  if(typeof($localStorage.ostCart)=='undefined')
	$localStorage.ostCart = [];

  var service = {
    addToCart: function (product) {

	  var isAddable  = true;
	  var prodInCart = false;
	  $localStorage.ostCart.forEach(function(prod, index){
		if (prod.id === product.id || prod.id === product.model) { 
			if (prod.quantity<=0) { 
				$rootScope.showAlert("You can buy only "+prod.purchaseQuantity+" quantity of this product. Because it is not in stock.");
				isAddable = false;
				return;
			}else{
				prodInCart = prod;	  return; 
			}
		}
	  });
	
	  if(isAddable){
		  if (prodInCart) {
			service.addOneProduct(prodInCart);
		  } else {
			var tpro = {id:product.id,quantity:product.quantity};
			tpro.purchaseQuantity = 0;
			tpro.realQty = product.quantity;
			service.addOneProduct(tpro);
			$localStorage.ostCart.push(tpro);
		  }
	  }
	  return isAddable;
    },
	 addOneProduct: function (product) {
		--product.quantity;
		++product.purchaseQuantity;

		if(product.quantity<=0){
			angular.element(document.querySelector('#cartbtn_'+product.id)).addClass("ng-hide");
			angular.element(document.querySelector('#nostock_'+product.id)).removeClass("ng-hide");
		}
    },
	 removeOneProduct: function (product) {
		$localStorage.ostCart.forEach(function(prod, index){
			if (prod.id === product.model) {
			  ++prod.quantity;
			  --prod.purchaseQuantity;
			}
		});
    },
	 setRemove: function (product) {
		$localStorage.ostCart.forEach(function(prod, index){
			if (prod.id === product.model) {
			  prod.quantity=prod.realQty;
			  prod.purchaseQuantity=0;
			}
		});
		 
    },
	 remvoeProduct(product){
			$localStorage.ostCart.forEach(function(prod, i){
				if (product.id === prod.id) {
				  $localStorage.ostCart.splice(i, 1);
				}
			});
	},
	 checkProductAvailability:function(){
		   
			$localStorage.ostCart.forEach(function(prod, i){
				if (prod.quantity<=0) {
				    angular.element(document.querySelector('#cartbtn_'+prod.id)).addClass("ng-hide");
					angular.element(document.querySelector('#nostock_'+prod.id)).removeClass("ng-hide");
				}else{
					angular.element(document.querySelector('#cartbtn_'+prod.id)).removeClass("ng-hide");
					angular.element(document.querySelector('#nostock_'+prod.id)).addClass("ng-hide");
				}
			});
	}
  };

  return service;
});


//waze