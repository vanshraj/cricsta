var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://vanshaj:vanshaj@ds163721.mlab.com:63721/thinkquant');
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	username: {type: String, index:true},
	password: {type: String},
	email: {type: String},
	name: {type: String}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser =function( newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
			if(err) throw err;
	        newUser.password = hash;
			newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function( username, callback){
	var query = { username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function( id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function( candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, res) {
		if(err) throw err;
		callback(null, res);
	});
}