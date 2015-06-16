(function () {	
	angular
		.module('instaguideApp')
		.filter('formatTimes', formatTimes);


	function formatTimes () {
		return function (times) {
			var timeString = "";
			if(times instanceof Array){
				for(var x = 0; x < times.length; x++){
					timeString += times[x] + " ";	
				}
			}
			return timeString
		};
	}
})();	