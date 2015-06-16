(function(){
	
	angular
		.module('instaguideApp')
		.filter('addHtmlLineBreaks', addHtmlLineBreaks);

		function addHtmlLineBreaks(){

			return function(text){
		      var output = text.toString().replace(/\n/g, '<br/>');
		      return output;
			}

		};

})()