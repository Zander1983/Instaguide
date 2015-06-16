(function(){	
	angular
		.module('instaguideApp')
		.service('userService', userService);

	function userService($http){	
		return {
	        logIn: function(data) {
	            return $http.post('/api/login', data)
	        },
	 
	        logOut: function() {
	 
	        },

	        register: function(data) {
	 			return $http.post('/api/register', data)
	        }
    	}
    }
})();	