
var mongoose = require('mongoose');
var Guide = mongoose.model('User');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

var theEarth = (function(){
	var earthRadius = 6371; // km, miles is 3959 #A

	var getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius);
	}; 

	var getRadsFromDistance = function(distance) {
		return parseFloat(distance / earthRadius);
	}; 

	return {
		getDistanceFromRads : getDistanceFromRads,
		getRadsFromDistance : getRadsFromDistance
	};
})();


var updateAverageRating = function(guideid) {
	Guide
	.findById(guideid)
	.select('rating reviews')
	.exec(
		function(err, guide) {
			if (!err) {
				doSetAverageRating(guide);
			}
		});
};


var doSetAverageRating = function(guide) {
	var i, reviewCount, ratingAverage, ratingTotal;

	if (guide.reviews && guide.reviews.length > 0) {
		reviewCount = guide.reviews.length;
		ratingTotal = 0;
		for (i = 0; i < reviewCount; i++) {
		ratingTotal = ratingTotal + guide.reviews[i].rating;
		}

		ratingAverage = parseInt(ratingTotal / reviewCount, 10);

		guide.rating = ratingAverage;
		guide.save(function(err) {
			if (err) {
				console.log(err);
			} else {
			console.log("Average rating updated to", ratingAverage);
			}
		});
	}
};

/*
var Review = new mongoose.Schema({
	userId: {type: Schema.ObjectId, ref: 'User'},
	author: {type: String, required: true},
	rating: {type: Number, required: true, min: 0, max: 5},
	reviewText: {type: String, required: true},
	createdOn: {type: Date, "default": Date.now}
});*/


var doAddReview = function(req, res, guide) {
	console.log('in doAddReview and  req.body is ');
	console.log(req.body);
	if (!guide) {
		sendJsonResponse(res, 404, {
			"message": "guideid not found"
		});
	} else {
		guide.reviews.push({
			userId: req.body.author._id,
			author: req.body.author.firstName + ' ' + req.body.author.surname,
			rating: req.body.rating,
			reviewText: req.body.reviewText
		});
		guide.save(function(err, guide) {
			var thisReview;

			console.log('saving and err is ');
			console.log(err);

			if (err) {
				sendJsonResponse(res, 400, err);
			} else {
				updateAverageRating(guide._id);
				thisReview = guide.reviews[guide.reviews.length - 1];
				sendJsonResponse(res, 201, thisReview);
			}
		});
	}
};




module.exports.guidesListByDistance = function(req, res) {

	console.log('in the guidesListByDistance');
	var lng = req.query.lng, lat = req.query.lat;

	lng = parseFloat(lng);
	lat = parseFloat(lat);

	console.log('isNaN(lng) is ');
	console.log(isNaN(lng));

	if(isNaN(lng)){
		console.log('using standradrd dublin long/lat');
		lng = -6.267493699999932000;
		lat = 53.344103999999990000;
	}



	var maxDistance = req.query.maxDistance;

	maxDistance = 200;

	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};

	var geoOptions = {
		spherical: true,
		maxDistance: theEarth.getRadsFromDistance(maxDistance)
	};

	if (!lng || !lat) {
		sendJsonResponse(res, 404, {
			"message": "lng and lat query parameters are required"
		});
	return;
	}
	

	Guide.geoNear(point.coordinates, geoOptions, function (err, results, stats) {
		var guides = [];

		console.log('results are ');
		console.log(results);

		if (err) {
			sendJsonResponse(res, 404, err);
		} else {
			results.forEach(function(doc) {
				guides.push({
					distance: theEarth.getDistanceFromRads(doc.dis),
					name: doc.obj.firstName + ' ' + doc.obj.surname,
					startingPoint: doc.obj.startingPoint,
					rating: doc.obj.rating,
					topics: doc.obj.topics,
					_id: doc.obj._id
				});
			});

			sendJsonResponse(res, 200, guides);
		}
	});
};



module.exports.guideCreate = function(req, res) {

	console.log('req.body is ');
	console.log(req.body);

	var times = [];
	times = req.body.times2.split(',');

	var tourTimeSchema = [];
	tourTimeSchema.push({
		days:req.body.days1,
		times: times
	});

	/*
	req.body.times2.forEach(function(time){
		times.push = time;
	});*/

	Guide.create({
		name: req.body.name,
		startingPoint: req.body.startingPoint,
		topics: req.body.topics.split(","),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		tourTimeSchema: tourTimeSchema
}, function(err, guide) {
		if (err) {
		sendJsonResponse(res, 400, err);
		} else {
		sendJsonResponse(res, 201, guide);
		}
	});
};


module.exports.reviewsCreate = function(req, res) {

	console.log('in the reviewsCreate');

	var guideid = req.params.guideid;

	console.log('and guideid is '+guideid);

	if (guideid) {
		Guide
		.findById(guideid)
		.select('reviews')
		.exec(
			function(err, guide) {
					if (err) {
						sendJsonResponse(res, 400, err);
					} else {
						doAddReview(req, res, guide);
					}
				}
			);
		} else {
			sendJsonResponse(res, 404, {
				"message": "Not found, guideid required"
			});
		}
};


module.exports.guidesCreate = function (req, res) {
	sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.guideReadOne = function(req, res) {

	console.log('in guideReadOne');

	if (req.params && req.params.guideid) {
		Guide
			.findById(req.params.guideid)
			.exec(function(err, guide) {
				if (!guide) {
					sendJsonResponse(res, 404, {
					"message": "guideid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}
					sendJsonResponse(res, 200, guide);
				});
	} else {
		sendJsonResponse(res, 404, {
			"message": "No guideid in request"
		});
	}
};



module.exports.reviewsReadOne = function(req, res) {

	if (req.params && req.params.guideid && req.params.reviewid) {
		Guide
		.findById(req.params.guideid)
		.select('name reviews')
		.exec(
			function(err, guide) {
				var response, review;
				if (!guide) {
					sendJsonResponse(res, 404, {
					"message": "guideid not found"
					});
					return;
				} else if (err) {
				sendJsonResponse(res, 400, err);
				return;
				}

				if (guide.reviews && guide.reviews.length > 0) {

					review = guide.reviews.id(req.params.reviewid);

					if (!review) {
						sendJsonResponse(res, 404, {
						"message": "reviewid not found"
						});
					} else {
						response = {
							guide : {
							name : guide.name,
							id : req.params.guideid
							},
						review : review
						};

					sendJsonResponse(res, 200, response);
					}
				} else {
						sendJsonResponse(res, 404, {
						"message": "No reviews found"
						});
				}
				});

				} else {
						sendJsonResponse(res, 404, {
						"message": "Not found, guideid and reviewid are both required"
					});
				}
};



module.exports.guidesUpdateOne = function(req, res) {
    if (!req.params.guideid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, guideid is required"
        });
        return;
    }

    var tourTimeSchema = [];

    if(req.body.times1){
	    tourTimeSchema.push({
	    	days: req.body.days1,
	    	times: req.body.times1.split(',')
	    });    	
    }

    if(req.body.times2){
	    tourTimeSchema.push({
	    	days: req.body.days2,
	    	times: req.body.times2.split(',')
	    });    	
    }

    Guide
        .findById(req.params.guideid)
    .select('-reviews -rating')
        .exec(
            function(err, guide) {
                if (!guide) {
                    sendJsonResponse(res, 404, {
                        "message": "guideid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }

                if(req.body.name){
                guide.name = req.body.name;
                }

                if(req.body.startingPoint){
                guide.startingPoint = req.body.startingPoint;                	
                }

                if(req.body.topics){
                guide.topics = req.body.topics.split(",");                	
                }

                if(req.body.lng){
                guide.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];                	
                }

                if(tourTimeSchema){
                guide.tourTimeSchema = tourTimeSchema;                	
                }


                guide.save(function(err, guide) {

                    if (err) {
                        sendJsonResponse(res, 404, err);

                    } else {
                        sendJsonResponse(res, 200, guide);

                    }
                });
            }
        );
};


module.exports.reviewsUpdateOne = function(req, res) {
    if (!req.params.guideid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, guideid and reviewid are both required"
        });
        return;
    }
    Guide
        .findById(req.params.guideid)

    .select('reviews')
        .exec(
            function(err, guide) {
                var thisReview;
                if (!guide) {
                    sendJsonResponse(res, 404, {
                        "message": "guideid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (guide.reviews && guide.reviews.length > 0) {
                    thisReview = guide.reviews.id(req.params.reviewid);
                    if (!thisReview) {
                        sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        thisReview.author.displayName = req.body.author;
                        thisReview.rating = req.body.rating;
                        thisReview.reviewText = req.body.reviewText;
                        guide.save(function(err, guide) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(guide._id);
                                sendJsonResponse(res, 200, thisReview);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No review to update"
                    });
                }
            }
        );
};


module.exports.guideDeleteOne = function(req, res) {
    var guideid = req.params.guideid;
    if (guideid) {
        Guide
            .findByIdAndRemove(guideid)
            .exec(
                function(err, guide) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                    sendJsonResponse(res, 204, null);
                }
            );
    } else {
        sendJsonResponse(res, 404, {
            "message": "No guideid"
        });
    }
};




module.exports.reviewsDeleteOne = function(req, res) {
    if (!req.params.guideid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, guideid and reviewid are both required"
        });
        return;
    }
    Guide
        .findById(req.params.guideid)
        .select('reviews')
        .exec(
            function(err, guide) {
                if (!guide) {
                    sendJsonResponse(res, 404, {
                        "message": "guideid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                if (guide.reviews && guide.reviews.length > 0) {
                    if (!guide.reviews.id(req.params.reviewid)) {
                        sendJsonResponse(res, 404, {
                            "message": "reviewid not found"
                        });
                    } else {
                        guide.reviews.id(req.params.reviewid).remove();
                        guide.save(function(err) {
                            if (err) {
                                sendJsonResponse(res, 404, err);
                            } else {
                                updateAverageRating(guide._id);
                                sendJsonResponse(res, 204, null);
                            }
                        });
                    }
                } else {
                    sendJsonResponse(res, 404, {
                        "message": "No review to delete"
                    });
                }
            }
        );
};



