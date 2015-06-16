(function(){	
	angular
		.module('instaguideApp')
		.service('authenticationData', authenticationData);

	function authenticationData(){
		
		var auth = {
			isLoggedIn: false,
			user: {},
			token: ''
		};
		return auth;
	}
})();	