(function(){

	angular
		.module('instaguideApp')
		.controller('reviewModalCtrl', reviewModalCtrl);

		reviewModalCtrl.$inject = ['$modalInstance', 'instaguideData', 'guideData', 'authenticationData'];
		function reviewModalCtrl($modalInstance, instaguideData, guideData, authenticationData){
			var vm = this;

			console.log('guideData is ');
			console.log(guideData);

			vm.guideData = guideData;
			vm.user = authenticationData.user;

			console.log('authenticationData is ');
			console.log(authenticationData);


			vm.modal = {
				cancel: function(){
					$modalInstance.dismiss('cancel');
				},
				close: function(res){
					$modalInstance.close(res);
				}
			};

			vm.onSubmit = function () {
				vm.formError = "";

				console.log('vm, is ');
				console.log(vm);
				
				if(!vm.formData || !vm.formData.rating || !vm.formData.reviewText) {
					vm.formError = "All fields required, please try again";
					return false;
				} else {
					console.log(vm.formData);
					vm.doAddReview(vm.guideData.guideid, vm.formData)

				}
			};

			vm.doAddReview = function (guideid, formData) {
				instaguideData.addReviewById(guideid, {
					author : authenticationData.user,
					rating : formData.rating,
					reviewText : formData.reviewText
				})
				.success(function (data) {
					vm.modal.close(data);
				})
				.error(function (data) {
					vm.formError = "Your review has not been saved, try again";
				});
				return false;
			};

		}
})()