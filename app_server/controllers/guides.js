var request = require('request')
var apiOptions = {
    server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
    apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}


var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404, page not found";
    content = "Oh dear. Looks like we can't find this page. Sorry.";
  } else if (status === 500) {
    title = "500, internal server error";
    content = "How embarrassing. There's a problem with our server.";
  } else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};



var _formatDistance = function(distance) {
    var numDistance, unit;
    if (distance > 1) {
        numDistance = parseFloat(distance).toFixed(1);
        unit = 'km';
    } else {
        numDistance = parseInt(distance * 1000, 10);
        unit = 'm';
    }
    return numDistance + unit;
};


var renderHomepage = function(req, res, responseBody){

    var message;

    if (!(responseBody instanceof Array)) {
        message = "API lookup error";
        responseBody = [];
    } else {
        if (!responseBody.length) {
            message = "No places found nearby";
        }
    }    

    res.render('guides-list', {
        title: 'InstaGuide - find a local guide near you',
        pageHeader: {
            title: 'InstaGuide',
            strapline: 'Discover delights on the locals know about!'
        },
        guides: responseBody,
        sidebar: 'Looking for a someone to show you the local delights? Let InstaGuide find you a local guide near you.',
        message: message    
    });
};


var renderHomepage = function(req, res){
    res.render('guides-list', 
        {
            title: 'InstaGuide - find a local guide near you',
            pageHeader: {
                title: 'InstaGuide',
                strapline: 'find a local guide near you!'
            },
            sidebar: "Travelling to a new destination and looking for the best local guides? Let InstaGuide find the best guide for you"
            }
    );
};


/* GET 'home' page */
module.exports.homelist = function(req, res) {

   renderHomepage(req, res);
};


var renderGuide = function(req, res, data){

    res.render('guide-info', 
        { 
            title: data.name, 
            pageHeader: {title: data.name},
            sidebar: {
                context: 'is on InstaGuide because it has accessible wifi and space to sit down with your laptop and get some work done.',
                callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
            },
            guide: data
        });

    console.log('guide is ');
    console.log(data);
};

/* GET 'Location info' page */
module.exports.guideInfo = function(req, res){
    getGuideInfo(req, res, function(req, res, responseData) {
        renderGuide(req, res, responseData);
    });  
};

var getGuideInfo = function(req, res, callback) {
    var requestOptions, path;
    path = "/api/guides/" + req.params.guideid;
    requestOptions = {
        url: apiOptions.server + path,
        method: "GET",
        json: {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            var data = body;
            if (response.statusCode === 200) {
                data.coords = {
                    lng: body.coords[0],
                    lat: body.coords[1]
                };
                callback(req, res, data);
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};


var renderReviewForm = function(req, res, guideDetail) {
    res.render('guide-review-form', {
        title: 'Review ' + guideDetail.name + ' on InstaGuide',
        pageHeader: {
            title: 'Review ' + guideDetail.name
        },
        user: {
            displayName: "Simon Holmes"
        },
        error: req.query.err
    });
};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
    getGuideInfo(req, res, function(req, res, responseData) {
        renderReviewForm(req, res, responseData);
    });
};


module.exports.doAddReview = function(req, res) {
    var requestOptions, path, guideid, postdata;
    guideid = req.params.guideid;
    path = "/api/guides/" + guideid + '/reviews';
    postdata = {
        author: req.body.name,
        rating: parseInt(req.body.rating, 10),
        reviewText: req.body.review
    };
    requestOptions = {
        url: apiOptions.server + path,
        method: "POST",
        json: postdata
    };



    if (!postdata.author || !postdata.rating || !postdata.reviewText) {
        res.redirect('/guides/' + guideid + '/reviews/new?err=val');
    } else {
        request(
            requestOptions,
            function(err, response, body) {
                if (response.statusCode === 201) {
                    res.redirect('/guides/' + guideid);
                }
                else if (response.statusCode === 400 && body.name && body.name ==="ValidationError" ) {
                    res.redirect('/guides/' + guideid + '/reviews/new?err=val'); 
                } 
                else {
                    _showError(req, res, response.statusCode);
                }
            }
        );
    }
};