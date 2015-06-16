(function(){	
	angular
		.module('instaguideApp')
		.service('geolocationData', geolocationData);

	function geolocationData(){
		
		var getPosition = function (cbSuccess, cbError, cbNoGeo) {

			console.log('in the getPosition');

			if (navigator.geolocation) {
				console.log('in the if');
				navigator.geolocation.getCurrentPosition(cbSuccess, cbSuccess);
			}
			else {
				console.log('in the else');
				cbSuccess();
			}
		};

		console.log('in geolocationData');
		return {
			getPosition : getPosition
		};
	}
})();	