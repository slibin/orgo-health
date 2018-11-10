angular.module('groceryworld.services')
.factory('shoppingcartService', function(httpRequestFactory) {
  'use strict';

  var service = {
    addToCart: function (data) {
		var cartItems = service.filterCart(data);
		 return httpRequestFactory.postRequest('cart',data);
    },
	addBulkCart: function (data) {
		// var cartItems = service.filterCart(data);
		// console.log(cartItems);
		 return httpRequestFactory.postRequest('cart_bulk',data);
    },
	updateCart: function (data) {
		 return httpRequestFactory.putRequest('cart/update',data);
    },
	deletCartItem: function (data) {
		 return httpRequestFactory.deleteRequest('cart/'+data.key);
    },
	emptyCart: function () {
		 return httpRequestFactory.deleteRequest('cart/cartempty');
    },
	getCart: function () {
		 return httpRequestFactory.getRequest('cart');
    },
	getBillShipAddress: function () {
		 return httpRequestFactory.getRequest('paymentaddress');
    },
	addBillingAddress: function (data) {
		 return httpRequestFactory.postRequest('paymentaddress',data);
    },
	addShippingAddress: function (data) {
		 return httpRequestFactory.postRequest('shippingaddress',data,'N');
    },
	getShippingMethods: function () {
    console.log("from services");
		 return httpRequestFactory.getRequest('shippingmethods');
    },
	addShippingMethods: function (data) {
		 return httpRequestFactory.postRequest('shippingmethods',data);
    },
	getPaymentMethods: function () {
		 return httpRequestFactory.getRequest('paymentmethods');
    },
	addPaymentMethods: function (data) {
		 return httpRequestFactory.postRequest('paymentmethods',data);
    },
	discountOnCoupon: function (data) {
		 return httpRequestFactory.postRequest('coupon',data);
    },
	orderConfirm: function () {
		 return httpRequestFactory.postRequest('confirm');
    },
	paymentStatus: function () {
		 return httpRequestFactory.postRequest('pay');
    },
	paymentConfirm: function () {
		 return httpRequestFactory.putRequest('confirm');
    },
	getOrderStatus: function (order_id) {
		 return httpRequestFactory.getRequest('orderhistory/id/'+order_id,'No');
    },
	cancelOrder: function (oid) {
		 return httpRequestFactory.cancelOrder(oid);
    },
	setOrderStatus: function (data,oid) {
		 return httpRequestFactory.putRequest('orderhistory/'+oid,data);
    },
	getDeliveryTime: function (data) {
		 return httpRequestFactory.postRequest('datetime/',data);
    },
	filterCart: function(data){
		var rval = [];
		 angular.forEach(data,function(Obj){
			rval.push({product_id:Obj.id,quantity:Obj.purchaseQuantity,option:''});
		 });
		 return rval;
	}
  };

  return service;
});
