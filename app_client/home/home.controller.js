(function(){    
    angular
    .module('instaguideApp')
    .controller('homeCtrl', homeCtrl);

    homeCtrl.$inject = ['$window', '$scope', 'instaguideData', 'geolocationData', 'authenticationData'];
    function homeCtrl($window, $scope, instaguideData, geolocationData, authenticationData) {
        var vm = this;

        vm.pageHeader = {
            title: 'InstaGuide',
            strapline: 'Find the best local guides in a new city!'
        };
        vm.sidebar = {
            content: "Travelling soon? Want to find the best local guide near you? Use InstaGuide!"
        };
        vm.message = "Checking your location";


        vm.getData = function(position) {

            if(position && position.coords){
            var lat = position.coords.latitude,
                lng = position.coords.longitude;
            }
            else{
            var lat = '',
                lng = '';
            }


            vm.message = "Searching for nearby places";


            instaguideData.guideByCoords(lat, lng)
    	        .success(function(data) {

                    console.log('data is ');
                    console.log(data);


    	            vm.message = data.length > 0 ? "" : "No locations found nearby";
    	            vm.data = {
    	                guides: data
    	            };    
            	})
    	        .error(function(e) {

        	        vm.message = "Sorry, something's gone wrong";

            	});

        };

        vm.showError = function(error) {
            $scope.$apply(function() {
                vm.message = error.message;
            });
        };

        vm.noGeo = function() {
            $scope.$apply(function() {
                vm.message = "Geolocation is not supported by this browser.";
            });
        };

        geolocationData.getPosition(vm.getData, vm.showError, vm.noGeo);
    }
})();       