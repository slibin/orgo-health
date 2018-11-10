angular.module('groceryworld.controllers')
.controller('ProfileCtrl', function($scope,$rootScope,usersService,alertmsgService,ionicMaterialInk,$location) {
	'use strict';

	   $scope.profileData = {
			email:$rootScope.userData.email,
			firstname:$rootScope.userData.firstname,
			lastname:$rootScope.userData.lastname,
			telephone:$rootScope.userData.telephone
		};

		$scope.updateProfile = function(form){
			if(form.$valid) {
				usersService.profileUpdate($scope.profileData)
				.then(function(response) {
					if(response.success){
						$scope.reloadProfile();

					}else{
						alertmsgService.tostMessage(response.error);
					}
				}, function(error) {
					 alertmsgService.tostMessage(response.error);
				});
			}
		}

		$scope.reloadProfile = function(){
			usersService.userDetails()
			.then(function(response) {
				if(response.success){
					$rootScope.userData = response.data;
					alertmsgService.showMessage('Profile updated successfully!');
					$location.path("app/dashboard");
				}else{
					alertmsgService.tostMessage(response.error);
					//$rootScope.userData='';
				}
			});
		}

	ionicMaterialInk.displayEffect();
})

.controller('ChagnepwdCtrl', function($scope,$rootScope,alertmsgService,usersService,ionicMaterialInk) {
	'use strict';

	$scope.updatePwd = {password:'',confirm:''};

	$scope.changePassword = function(form){
		if(form.$valid) {
			usersService.userChagnepwd($scope.updatePwd)
			.then(function(response) {
				console.log(response);
				if(response.success){
					$scope.updatePwd = {password:'',confirm:''};
					alertmsgService.showMessage('Password successfully updated!');
				}else{
					alertmsgService.tostMessage(response.error);
				}
			}, function(error) {
				 alertmsgService.tostMessage(response.error);
			});
		}
	}

	ionicMaterialInk.displayEffect();
})

.controller('ContactCtrl', function($scope,$rootScope,alertmsgService,usersService,ionicMaterialInk) {
	'use strict';
//	$rootScope.hideTabs = 0;
	$scope.contactData = {email:'',name:'',enquiry:''};

	$scope.addContact = function(form){
		if(form.$valid) {
			usersService.contactAdd($scope.contactData)
			.then(function(response) {
				if(response.success){
					alertmsgService.showMessage(response.message);

				}else{
					alertmsgService.tostMessage(response.error);
				}
			}, function(error) {
				 alertmsgService.tostMessage(response.error);
			});
		}
	}
	ionicMaterialInk.displayEffect();
})
.controller('OfferCtrl', function($scope,$rootScope,alertmsgService,usersService,ionicMaterialInk) {
	'use strict';
	
			usersService.offer()
			.then(function(response) {
				if(response.success){
				 console.log(response);
					$scope.offers=response.data;
					console.log($scope.offers);

				}else{
					alertmsgService.tostMessage(response.error);
				}
			}, function(error) {
				 alertmsgService.tostMessage(response.error);
			});

	ionicMaterialInk.displayEffect();
});
