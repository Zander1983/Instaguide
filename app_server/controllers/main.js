
/* GET 'about us' page */
module.exports.about = function(req, res){
res.render('index', { title: 'About' });
};
/* GET 'sign in' page */
module.exports.signin = function(req, res){
res.render('signin-index', { title: 'Sign in' });
};

module.exports.about = function(req, res){
res.render('generic-text', { title: 'About' });
};

module.exports.angularApp = function(req, res){

console.log('in angularApp');

res.render('layout', { title: 'InstaGuide' });
};