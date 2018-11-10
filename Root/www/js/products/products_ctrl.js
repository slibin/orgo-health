angular.module('groceryworld.controllers')
.controller('ProductsCtrl', function($scope,$rootScope,$location,$timeout,$ionicModal,$stateParams,$ionicScrollDelegate,$ionicSideMenuDelegate,productsService,progressService,eCart,shoppingcartService,alertmsgService,ionicMaterialInk) {
	'use strict';
//	$rootScope.hideTabs = 0;
	if($ionicSideMenuDelegate.isOpen())	$ionicSideMenuDelegate.toggleLeft();

		$rootScope.isCartIconVisible = true;

    //$ionicSideMenuDelegate.canDragContent(true); // hide sidemenu
   //---------------------------------------------------
   $scope.cat_id	= $stateParams.catid;
   $scope.catname	= $stateParams.catname;
   console.log($scope.cat_id);
	 console.log($scope.catname);
   if( $scope.cat_id>0){
	   $rootScope.backToProduct = '#/app/products/'+$scope.cat_id;
		 console.log($rootScope.backToProduct);
   }else{
	   $rootScope.backToProduct = '#/app/search/0/'+$scope.catname;
   }

   $rootScope.sortProductBy = 'sort_order-ASC';
   $scope.noRecords = false;
   //----------Lasy Loading of Products---------------------------
   $scope.loadMoreProducts = function(){
		$scope.noRecords = false;

		productsService.getProducts($scope.cat_id,$scope.catname,$scope.product_page)
		.then(function(response) {
			if(response.success){

				$scope.products		= $scope.products.concat(response.data);
				console.log("$scope.products",$scope.products);
				$scope.newProducts	= $scope.newProducts.concat(response.latest_products);

				$scope.product_page++;
				$scope.noProductsAvailable = false; // On lasy loading.
				$scope.$broadcast('scroll.infiniteScrollComplete');
			}else{
				 $scope.noProductsAvailable = true; // Off lasy loading.
				 if($scope.product_page==1)$scope.noRecords = true;
			}
			if($scope.product_page==1)$scope.getCartData();

		}, function(error) {
			 $scope.noProductsAvailable = true; // Off lasy loading.
		});
   }

   //---------------------------
	 $rootScope.showProducts = function(cat_id){
		//$scope.category_id =$scope.cat_id;
		$scope.$broadcast('scroll.refreshComplete');
		if(cat_id!='' && typeof(cat_id)!='undefined') $scope.cat_id = cat_id;

		$ionicScrollDelegate.scrollTop();
		$scope.selectedCat = findCategory($rootScope.accordionArray,$scope.cat_id);
		$scope.parentCats  = getParentCat($rootScope.accordionArray,$scope.cat_id);

		$scope.noProductsAvailable	= true; // Off lasy loading.
		$scope.product_page = 1;
		$scope.products		   = [];
		$scope.newProducts	   = [];

		$scope.loadMoreProducts();
	 }
	  $rootScope.showProducts();
   //---------------------------

   $scope.showProductDetail = function(pro_id){ $location.path('app/products-detail/'+pro_id); }
   $scope.gotoDashboard = function(){ $location.path('app/dashboard'); }

   //----------Cart Process--------------------
   $scope.selectId='';




   $scope.AddToCart = function(prodObj){
	   //var att_val = angular.element(document.querySelector('#selectedattr_'+prodObj.id)).attr('attval');
	   //console.log(att_val);

	   eCart.addToCart(prodObj);
	   //console.log(eCart.cartProducts);

	   var att_val ='';
	   if(att_val!=''){
			var attAr = att_val.split("|");
			var v1 = attAr[1];
			var v2 = attAr[2];

			//var att = {v1+':'+v2};
		    var cartobj = {product_id:prodObj.id,quantity:'1',option:{"13":"21"}}
	   }else{
			var cartobj = {product_id:prodObj.id,quantity:'1',option:''}
	   }

	   $scope.selectId=prodObj.id;
	   $timeout(function(){$scope.selectId='';  /*ostcartService.addToCart(prodObj);*/	}, 700);

	   shoppingcartService.addToCart(cartobj)
		.then(function(response) {

		   $scope.getCartData();
		}, function(error) {
			 alertmsgService.tostMessage(response.error);
		});

	}


	//------Sub categoryes Options-----
	$ionicModal.fromTemplateUrl('js/products/products-cats.html', { scope: $scope })
	.then(function(modal) { $scope.categoryModal = modal; });
	$scope.catsClose = function() { $scope.categoryModal.hide(); };
	$scope.catsShow = function() { $scope.categoryModal.show(); };

	//------Sort Options-----
	$ionicModal.fromTemplateUrl('js/products/products-sort.html', { scope: $scope })
	.then(function(modal) { $scope.sortModal = modal; });
	$scope.sortClose = function() { $scope.sortModal.hide(); };
	$scope.sortShow = function() {
		$scope.sortOptions = [
			{name:"Default",val:"sort_order-ASC"},
			{name:"Product Title A to Z",val:"name-ASC"},
			{name:"Product Title Z to A",val:"name-DESC"},
			{name:"Price- Low to High",val:"price-ASC"},
			{name:"Price- High to Low",val:"price-DESC"}
			];
		$scope.sortModal.show();
	};
	$scope.setProductSort = function(data){ $rootScope.sortProductBy = data; $scope.sortModal.hide(); $scope.showProducts(); }
	$scope.pro_attr= '0-0-0';
	//-----------------------
	$scope.selectAttrib = function(pid,att_price,pro_price){
		 var tmpArray = att_price.split("|");
		 var newPrice = (parseFloat(pro_price)+parseFloat(tmpArray[3])).toFixed(2);
		 //console.log(tmpArray[0]+" : "+tmpArray[1]+" : "+tmpArray[2]+" : "+tmpArray[3]);

		if(tmpArray[1]>0){
			 angular.element(document.querySelector('#sprice_'+pid)).addClass("hidePrice");
			 angular.element(document.querySelector('#attrprice_'+pid)).removeClass("hidePrice");
			 angular.element(document.querySelector('#attramt_'+pid)).html(newPrice);
			 var tmp = tmpArray[0]+"|"+tmpArray[1]+"|"+tmpArray[2];
			 angular.element(document.querySelector('#selectedattr_'+pid)).attr('attval',tmp);
		}else{
			 angular.element(document.querySelector('#sprice_'+pid)).removeClass("hidePrice");
			 angular.element(document.querySelector('#attrprice_'+pid)).addClass("hidePrice");
			 angular.element(document.querySelector('#attramt_'+pid)).html('');
			 angular.element(document.querySelector('#selectedattr_'+pid)).attr('attval','');
		}
	}
	//-----------------------

	ionicMaterialInk.displayEffect();
})

.controller('ProductsFilterCtrl', function($scope,$rootScope,$location,$stateParams,productsService,alertmsgService,ionicMaterialInk) {
	'use strict';
		$scope.cat_id	= $stateParams.catid;


		$scope.filterOptions = function(){
			$scope.$broadcast('scroll.refreshComplete');
			$scope.brandFilter = [];
			$scope.priceFilter = [];
			$scope.discountFilter = [];
			productsService.getFilterOptions($scope.cat_id)
			.then(function(response) {

				$scope.filterData = response;

				$scope.brandFilter		= response.brands_filter;
				$scope.priceFilter		= response.pricefilter;
				$scope.discountFilter	= response.discountfilter;
				console.log("$scope.priceFilter",$scope.priceFilter);
				getSelectedFilter($scope.brandFilter,productsService.getFilterData($scope.cat_id,'brands'),'brands'); // Select Filter values
				getSelectedFilter($scope.priceFilter,productsService.getFilterData($scope.cat_id,'price'),'price'); // Select Filter values
				getSelectedFilter($scope.discountFilter,productsService.getFilterData($scope.cat_id,'discount'),'discount'); // Select Filter values

			}, function(error) {
				alertmsgService.tostMessage(error);
			});
		}

		$scope.filterOptions();

		//-------Watch filter changes------
	    $scope.$watch('brandFilter|filter:{selected:true}', function (nv) { $scope.bids = nv.map(function (brand) { return brand.brand_id; });   }, true);
	    $scope.$watch('priceFilter|filter:{selected:true}', function (nv) { $scope.prange_val = nv.map(function (pricerange) { return pricerange.pricefilter; });  }, true);
	    $scope.$watch('discountFilter|filter:{selected:true}', function (nv) { $scope.drange_val = nv.map(function (discrange) { return discrange.discountfilter; });  }, true);
		//-----------------------
		$scope.applyFilter = function(){
			productsService.setFilterData($scope.cat_id,'brands',$scope.bids); /*set barnds filters */
			productsService.setFilterData($scope.cat_id,'price',$scope.prange_val); /*set price filters */
			console.log("$scope.prange_val",$scope.drange_val);
			productsService.setFilterData($scope.cat_id,'discount',$scope.drange_val); /*set discount filters */

			$rootScope.showProducts($scope.cat_id);
			$location.path('app/products/'+$scope.cat_id);
		}
		$scope.resetFilter = function(){
			$rootScope.brandsFobj = [];	$rootScope.priceFobj = [];	$rootScope.discFobj = [];
			$rootScope.showProducts($scope.cat_id);
			$location.path('app/products/'+$scope.cat_id);
		}
		//-----------------------



})

.controller('ProductsDetailCtrl', function($scope,$rootScope,$localStorage,$stateParams,$timeout,productsService,eCart,shoppingcartService,ionicMaterialInk) {
	'use strict';

		$scope.pid = $stateParams.proid;
		productsService.getProductDetail($stateParams.proid)
		.then(function(response) {

			//console.log(response);
			if(response.success){
				$scope.productDetail = response.data;
				$scope.avilableQTY = $scope.productDetail.quantity;
				if($scope.productDetail.quantity>0){
					$scope.isQtyAvail = true;
					$scope.checkQty();
				}else{
					$scope.isQtyAvail = false;
				}
			}

		}, function(error) {
			alertmsgService.tostMessage(error);
		});

		//-------------------------------
		$scope.checkQty = function(){

			eCart.cartProducts.forEach(function(prod, i){
				if(prod.id===$scope.pid){
					$scope.avilableQTY = prod.quantity;
					if (prod.quantity<=0) {
					  $scope.isQtyAvail = false;
					}
			    }
			});
		}

		//-------------------------------
		   $scope.selectId='';
		   $scope.AddToCart = function(prodObj){

			   var cartobj = {product_id:prodObj.id,quantity:'1',option:''}

			   $scope.selectId=prodObj.id;
			   $timeout(function(){$scope.selectId=''; 	}, 700);

			   shoppingcartService.addToCart(cartobj)
				.then(function(response) {
				   if(response.success){
						 eCart.addToCart(prodObj);  // add to localcart
						$scope.checkQty();
						$scope.getCartData();

				   }
				}, function(error) {
					 alertmsgService.tostMessage(response.error);
				});

			}
		//-------------------------------

	ionicMaterialInk.displayEffect();
});
