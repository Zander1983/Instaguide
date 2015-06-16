(function(){
	angular
		.module('instaguideApp')
		.controller('guideDetailCtrl', guideDetailCtrl);


		guideDetailCtrl.$inject = ['$routeParams', '$modal', 'instaguideData', 'authenticationData'];
		function guideDetailCtrl($routeParams, $modal, instaguideData, authenticationData){

			var vm = this;
			vm.guideid = $routeParams.guideid;
			vm.isLoggedIn = authenticationData.isLoggedIn;

			instaguideData.guideById(vm.guideid)
				.success(function(data){

					console.log('data is ');
					console.log(data);

					vm.time = {
						days: "Monday"
					}

					vm.pageHeader = {
						title: data.firstName + ' ' + data.surname,
					};

					vm.data = { 
						guide: data
					};

				})
				.error(function(err){

				})


				vm.popupReviewForm = function () {
					var modalInstance = $modal.open({
						templateUrl: '/reviewModal/reviewModal.view.html',
						controller: 'reviewModalCtrl as vm',
						resolve : {
							guideData : function () {
								return {
									guideid : vm.guideid,
									guideName : vm.data.guide.name
								};
							}
						}
					});

					modalInstance.result.then(function (data) {
						vm.data.guide.reviews.push(data);
					});
				};

	}

})()