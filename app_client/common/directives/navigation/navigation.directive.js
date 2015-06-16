(function(){
	angular
		.module('instaguideApp')
		.directive('navigation', navigation);

		function navigation(authenticationData, $location){


			return {
		      restrict: 'EA',
		      templateUrl: '/common/directives/navigation/navigation.template.html',
        	  scope: false,
		      link: function(scope, elem, attr) {

		      	console.log('in link  and elem is ');
		      	console.log(elem);

		      	scope.logout = function(){
		      		console.log('in directive logout');
		            if (authenticationData.isLoggedIn) {
		                authenticationData.isLoggedIn = false;
		                authenticationData.token = '';
		                authenticationData.user = {};

		                console.log('authenticationData is now ');
		                console.log(authenticationData);
		                $location.path("/");
		            }
		      	};

		        scope.data = {
		        	isLoggedIn: authenticationData.isLoggedIn
		        };
		      }
			};

		}
})()