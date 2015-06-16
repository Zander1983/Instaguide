var mongoose = require( 'mongoose' );
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var mongoose = require( 'mongoose' );


var Schema = mongoose.Schema;



var Review = new mongoose.Schema({
	userId: {type: Schema.ObjectId, ref: 'User'},
	author: {type: String, required: true},
	rating: {type: Number, required: true, min: 0, max: 5},
	reviewText: {type: String, required: true},
	createdOn: {type: Date, "default": Date.now}
});

var User = new mongoose.Schema({ 
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    isGuide: Boolean,
	startingPoint: String,
	rating: {type: Number, "default": 0, min: 0, max: 5},
	topics: [String],
	coords: {type: [Number], index: '2dsphere'},
  monFri: String,
  satSun: String,
	reviews: [Review]
});

User.pre('save', function(next) {
  var user = this;
  
  if (!user.isModified('password')) return next();
 
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);
 
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});

 
//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};

mongoose.model('User', User);



