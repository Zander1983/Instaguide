console.log('in routes/main TOP');

var ctrl = require('../app_server/controllers/main'); 


module.exports = function (app) {

	console.log('in module.exports and app is ');
	console.log(app);

	app.get('/', ctrl.angularApp);
	app.get('/signin', ctrl.signin);
};

module.exports = function (app) {
	app.get('/about', ctrl.about);
};