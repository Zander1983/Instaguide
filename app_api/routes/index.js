var express = require('express');
var router = express.Router();
var ctrlGuides = require('../controllers/guides');
var ctrlUsers = require('../controllers/users');

var jwt = require('express-jwt');
var secret = require('../secret');

//var ctrlGuides = require('../controllers/reviews');

router.get('/guides', ctrlGuides.guidesListByDistance);

router.get('/guides/:guideid', ctrlGuides.guideReadOne);

router.post('/login', ctrlUsers.signin);
router.post('/register', ctrlUsers.register);

/*
router.post('/guides', ctrlGuides.guidesCreate);

router.put('/guides/:guideid', ctrlGuides.guidesUpdateOne);
router.delete('/guides/:guideid', ctrlGuides.guidesDeleteOne);
*/
// reviews

router.post('/guides/:guideid/reviews', jwt({secret: secret.secretToken}), ctrlGuides.reviewsCreate);
router.get('/guides/:guideid/reviews/:reviewid', ctrlGuides.reviewsReadOne);
router.put('/guides/:guideid/reviews/:reviewid', ctrlGuides.reviewsUpdateOne);
router.delete('/guides/:guideid/reviews/:reviewid', ctrlGuides.reviewsDeleteOne);

module.exports = router;
