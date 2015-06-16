
var _isNumeric = function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};
var formatDistance = function() {
    return function(distance) {
        var numDistance, unit;
        if (distance && _isNumeric(distance)) {
            if (distance > 1) {
                numDistance = parseFloat(distance).toFixed(1);
                unit = 'km';
            } else {
                numDistance = parseInt(distance * 1000, 10);
                unit = 'm';
            }
            return numDistance + unit;
        } else {
            return "?";
        }
    };
};

var ratingStars = function () {
	console.log('in rating states');
	return {
		scope: {
			thisRating : '=rating'
		},
		templateUrl: '/angular/rating-stars.html'
	};
};



var guideListCtrl = function($scope, instaguideData, geolocation) {
    $scope.message = "Checking your location";

    $scope.getData = function(position) {

    	console.log('position is ');
    	console.log(position);

        $scope.message = "Searching for nearby guides";
        instaguideData
        	.guideByCoords(position.coords.latitude, position.coords.longitude)
            .success(function(data) {
                $scope.message = data.length > 0 ? "" : "No guides found";
                $scope.data = {
                    guides: data
                };
            })
            .error(function(e) {
                $scope.message = "Sorry, something's gone wrong";
            });
    };
    $scope.showError = function(error) {
        $scope.$apply(function() {
            $scope.message = error.message;
        });
    };
    $scope.noGeo = function() {
        $scope.$apply(function() {
            $scope.message = "Geolocation not supported by this browser.";

        });

    };
    geolocation.getPosition($scope.getData, $scope.showError, $scope.noGeo);
};



var instaguideData = function ($http) {
	var guideByCoords = function (lat, lng) {
		return $http.get('/api/guides?lng=' + lng + '&lat=' + lat + '&maxDistance=200');
	};

	return{
		guideByCoords: guideByCoords
	};
};


var geolocation = function () {
	var getPosition = function (cbSuccess, cbError, cbNoGeo) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
			}
			else {
				cbNoGeo();
			}
		};
		
		return {
			getPosition : getPosition
		};
};

angular
	.module('instaguide', [])
	.filter('formatDistance', formatDistance)
	.directive('ratingStars', ratingStars)
	.service('instaguideData', instaguideData)	
	.controller('guideListCtrl', guideListCtrl)
	.service('geolocation', geolocation);

