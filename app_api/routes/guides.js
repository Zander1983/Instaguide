

//NOT USED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



var ctrl = require('../controllers/guides'); 
var jwt = require('express-jwt');
var secret = require('./secret');

module.exports = function(app){
	// guides

	console.log('doing the app.get');

	app.get('/api/guides/:guideid', jwt({secret: secret.secretToken}), ctrl.guideReadOne);

	app.get('/api/guides/:guideid/reviews/:reviewid', ctrl.reviewsReadOne);

	app.get('/api/guides', ctrl.guidesListByDistance);

	app.post('/api/guides', ctrl.guideCreate);

	app.post('/api/guides/:guideid/reviews', ctrl.reviewsCreate);


	app.put('/api/guides/:guideid', ctrl.guidesUpdateOne);

	app.put('/api/guides/:guideid/reviews/:reviewid', ctrl.reviewsUpdateOne);

	app.delete('/api/guides/:guideid', ctrl.guideDeleteOne);

	//app.delete('/api/guides/:guideid/reviews/:reviewid', ctrl.reviewsDeleteOne);


};