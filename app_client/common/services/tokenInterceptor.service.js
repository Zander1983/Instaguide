(function(){
	
	angular
		.module('instaguideApp')
		.service('tokenInterceptor', tokenInterceptor);

		function tokenInterceptor($q, $window, $location, authenticationData){
			    return {
			        request: function (config) {
			            config.headers = config.headers || {};
			            if (authenticationData.token) {
			                config.headers.Authorization = 'Bearer ' + authenticationData.token;
			            }
			            return config;
			        },

			        requestError: function(rejection) {
			            return $q.reject(rejection);
			        },

			        /* Set Authentication.isAuthenticated to true if 200 received */
			        response: function (response) {
			            if (response != null && response.status == 200 && $window.sessionStorage.token && !authenticationData.isAuthenticated) {
			                authenticationData.isAuthenticated = true;
			            }
			            return response || $q.when(response);
			        },

			        /* Revoke client authentication if 401 is received */
			        responseError: function(rejection) {
			            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || authenticationData.isAuthenticated)) {
			                delete $window.sessionStorage.token;
			                authenticationData.isAuthenticated = false;
			                $location.path("/admin/login");
			            }

			            return $q.reject(rejection);
			        }
			    };

		};


})()