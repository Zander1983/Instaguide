var express = require('express');
var router = express.Router();
var ctrlGuides = require('../controllers/guides');
var ctrlOthers = require('../controllers/main');

/* Guides pages */
router.get('/', ctrlOthers.angularApp);
router.get('/guide/:guideid', ctrlGuides.guideInfo);
router.get('/guide/:guideid/review/new', ctrlGuides.addReview);
router.post('/guide/:guideid/review/new', ctrlGuides.doAddReview);

/* Other pages */
router.get('/about', ctrlOthers.about);

module.exports = router;
