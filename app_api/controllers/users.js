var mongoose = require('mongoose');
var User = mongoose.model('User');


var jwt = require('jsonwebtoken');
var secret = require('../secret');

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var generateToken = function(email){

    var profile = {
            email: email
    };

    // We are sending the profile inside the token
    return jwt.sign(profile, secret.secretToken, { expiresInMinutes: 60*5 });
}

//var tokenManager = require('../config/token_manager');

exports.signin = function(req, res) {

    console.log('in signin');


    var email = req.body.email || '';
    var password = req.body.password || '';
    
    if (email == '' || password == '') { 
        return res.send(401); 
    }

    User.findOne({email: email}, function (err, user) {
        if (err || !user) {
            console.log('failed to find user and err is ');
            console.log(err);
            sendJsonResponse(res, 400, err);
        }
        else{      

            console.log('found user....and user is ');
            console.log(user);

            user.comparePassword(password, function(isMatch) {
                if (!isMatch) {

                    sendJsonResponse(res, 400, err);
                }

                var token = generateToken(user.email);
                
                sendJsonResponse(res, 200, {token: token, user: user});
            });
        }        
    });
};


exports.register = function(req, res) {

        console.log('in the register controller and req.body is ');
        console.log(req.body);

        var data = {};

        if(req.body.isGuide && req.body.isGuide==true){
              data = {
                firstName: req.body.firstName,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                isGuide: req.body.isGuide,
                startingPoint: req.body.startingPoint,
                topics: req.body.topics.split(","),
                coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
                monFri: req.body.monFri,
                satSun: req.body.satSun
            };
        }
        else{
            data = {
                firstName: req.body.firstName,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password
            };
        }

        console.log('data is ');
        console.log(data);

        User.create(data, function(err, user) {

            console.log('****************************************err is ');
            console.log(err);

            if (err) {
                sendJsonResponse(res, 400, err);
            } else {
                var token = generateToken(user.email);
                
                sendJsonResponse(res, 200, {token: token, user: user});
            }
        });
};


/*
exports.logout = function(req, res) {
    if (req.user) {
        tokenManager.expireToken(req.headers);

        delete req.user;    
        return res.send(200);
    }
    else {
        return res.send(401);
    }
}

exports.register = function(req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';

    if (username == '' || password == '' || password != passwordConfirmation) {
        return res.send(400);
    }

    var user = new db.userModel();
    user.username = username;
    user.password = password;

    user.save(function(err) {
        if (err) {
            console.log(err);
            return res.send(500);
        }   
        
        db.userModel.count(function(err, counter) {
            if (err) {
                console.log(err);
                return res.send(500);
            }

            if (counter == 1) {
                db.userModel.update({username:user.username}, {is_admin:true}, function(err, nbRow) {
                    if (err) {
                        console.log(err);
                        return res.send(500);
                    }

                    console.log('First user created as an Admin');
                    return res.send(200);
                });
            } 
            else {
                return res.send(200);
            }
        });
    });
}*/