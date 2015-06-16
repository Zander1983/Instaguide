(function(){	
	angular
		.module('instaguideApp')
		.service('instaguideData', instaguideData);

	instaguideData.$inject = ['$http'];
	function instaguideData($http){

		var guideByCoords = function(lat, lng){
			return $http.get('/api/guides?lng=' + lng + '&lat=' + lat +'&maxDistance=20');
		};

	    var guideById = function (guideid) {
      		return $http.get('/api/guides/' + guideid);
    	};

    	var addReviewById = function(guideid, data){
    		return $http.post('/api/guides/' + guideid + '/reviews', data)
    	};

		return{
			guideByCoords: guideByCoords,
			guideById: guideById,
			addReviewById: addReviewById
		}

	}
})();		