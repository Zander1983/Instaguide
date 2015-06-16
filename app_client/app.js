(function () {

	angular.module('instaguideApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap']);

	function config ($routeProvider, $locationProvider, $httpProvider) {

		$routeProvider
			.when('/', {
				templateUrl: 'home/home.view.html',
				controller: 'homeCtrl',
				controllerAs: 'vm'
			})
			.when('/about', {
		        templateUrl: '/common/views/genericText.view.html',
		        controller: 'aboutCtrl',
		        controllerAs: 'vm'
	    	})
			.when('/guide/:guideid', {
				templateUrl: '/guideDetail/guideDetail.view.html',
				controller: 'guideDetailCtrl',
				controllerAs: 'vm'
			})
			.when('/login', {
	            templateUrl: '/users/login.view.html',
	            controller: 'adminUserCtrl',
	            controllerAs: 'vm'
        	})
			.when('/register', {
	            templateUrl: '/users/register.view.html',
	            controller: 'registerUserCtrl',
	            controllerAs: 'vm'
        	})
			.otherwise({redirectTo: '/'});

			$locationProvider.html5Mode(true);					
		    
		    $httpProvider.interceptors.push('tokenInterceptor');
			
	} 

	angular
	.module('instaguideApp')
	.config(['$routeProvider', '$locationProvider', '$httpProvider', config]);

})();	