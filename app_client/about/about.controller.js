(function(){
	angular
		.module('instaguideApp')
		.controller('aboutCtrl', aboutCtrl);

		aboutCtrl.$inject = ['$sce'];
		function aboutCtrl($sce){

			var vm = this;
			vm.pageHeader = {
				title: 'About Instaguide',
			};
			vm.main = {
				content: $sce.trustAsHtml('InstaGuide was created to help people find the best local guides')
			};

		    console.log('vm is ');
    		console.log(vm);
		}
})();