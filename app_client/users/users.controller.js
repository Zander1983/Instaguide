(function(){
	angular
		.module('instaguideApp')
		.controller('adminUserCtrl', adminUserCtrl);


		function adminUserCtrl($scope, $location, $window, userService, authenticationData){

			var vm = this;

			vm.pageHeader = {
				title: 'Login',
			};

			vm.onSubmit = function () {
				vm.formError = "";

				console.log('vm, is ');
				console.log(vm);
				
				if(!vm.formData || !vm.formData.email || !vm.formData.password) {
					vm.formError = "All fields required, please try again";
					return false;
				} else {
					console.log(vm.formData);
					vm.logIn({
						email: vm.formData.email,
						password: vm.formData.password
					})

				}
			};

		        //Admin User Controller (login, logout)
        	vm.logIn = function logIn(data) {

	                userService.logIn(data)
		                .success(function(data) {

		                	console.log('successfully logged in.........');		

		                    authenticationData.isLoggedIn = true;
		                    authenticationData.user = data.user;
		                    authenticationData.token = data.token;

		                    $location.path("/");
		                }).error(function(status, data) {
		                    vm.formError = "There was a problem loggin you in, please try again";
		                });
		        
			}

            vm.logout = function logout() {
            	console.log('in logout');
		            if (authenticationData.isLoggedIn) {
		                authenticationData.isLoggedIn = false;
		                authenticationData.token = '';
		                authenticationData.user = {};

		                console.log('authenticationData is now ');
		                console.log(authenticationData);
		                $location.path("/");
		            }
	        }
		}	

})()