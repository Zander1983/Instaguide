(function(){
	angular
		.module('instaguideApp')
		.controller('registerUserCtrl', registerUserCtrl);


		function registerUserCtrl($scope, $location, $window, userService, authenticationData, $http){

		    $scope.result = '';
		    $scope.options = null;
		    $scope.details = '';

			var vm = this;

			vm.pageHeader = {
				title: 'Register',
			};

			vm.onSubmit = function () {
				vm.formError = "";

				console.log('vm, is ');
				console.log(vm);
				
				if(!vm.formData || !vm.formData.firstName || !vm.formData.surname || !vm.formData.email || !vm.formData.password) {
					vm.formError = "All fields required, please try again";
					return false;
				} else {

					console.log('form data is ');
					console.log(vm.formData);


					$http.get('http://maps.google.com/maps/api/geocode/json?address='+vm.formData.startingPoint+'&sensor=false')
					.success(function(mapData) {

						console.log('map data is ');
						console.log(mapData);

						if(mapData.results instanceof Array && mapData.status=="OK"){
							var lng = mapData.results[0].geometry.location.lng;
							var lat = mapData.results[0].geometry.location.lat;

							vm.formData.lng = lng;
							vm.formData.lat = lat;
							vm.register(vm.formData);					
						}
						else{
							vm.formError = "There was a problem finding this address";
						}

				      //angular.extend($scope, mapData);
				    });

				}
			};

		        //Admin User Controller (login, logout)
        	vm.register = function register(data) {

	                userService.register(data)
		                .success(function(data) {

		                	console.log('setting to true.....');

		                    authenticationData.isLoggedIn = true;
		                    authenticationData.user = data.user;
							authenticationData.token = data.token;

		                    $location.path("/");
		                }).error(function(status, data) {
		                    console.log(status);
		                    console.log(data);
		                    vm.formError = "This email has already been taken";
		                });
		        
			}

		}	

})()