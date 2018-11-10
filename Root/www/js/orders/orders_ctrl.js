angular.module('groceryworld.controllers')
.controller('OrdersCtrl', function($scope,$rootScope,$ionicModal,usersService,ionicMaterialInk) {
	'use strict';

    $scope.showOrders = function(){
		$scope.$broadcast('scroll.refreshComplete');
		$scope.ordersList = [];
		$scope.noOrders = false;
		usersService.getOrders()
		.then(function(response) {
			   if(response.success){
					$scope.ordersList = response.data.orders;
					//console.log($scope.ordersList );
			   }else{
					$scope.noOrders = true;
			   }

		});
	}
   $scope.showOrders();

	//------Sub categoryes Options-----
	$ionicModal.fromTemplateUrl('js/orders/orders-detail.html', { scope: $scope })
	.then(function(modal) { $scope.myorderModal = modal; });
	$scope.orderDetailClose = function() { $scope.myorderModal.hide(); };
	$scope.orderDetailShow = function(orderId) {
		$scope.isOrderDetail = false;
		$scope.myorderModal.show();
		$scope.odetail = [];
		$scope.oproducts = [];

		usersService.getOrdersDetail(orderId)
		.then(function(response) {
			   if(response.success){
					$scope.isOrderDetail = true;
					$scope.odetail = response.data;
					console.log("$scope.odetail",$scope.odetail);
					$scope.oproducts = response.data.products;
					console.log("$scope.oproducts",$scope.oproducts);
			   }
		});



	};


	ionicMaterialInk.displayEffect();
});
