(function () {

  angular
    .module('instaguideApp')
    .directive('ratingStars', ratingStars);

  function ratingStars () {
    return {
      restrict: 'EA',
      scope: {
        thisRating : '=ratingNum'
      },
      templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
    };
  }
})();