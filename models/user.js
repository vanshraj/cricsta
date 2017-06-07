var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect('mongodb://vanshaj:vanshaj@ds163721.mlab.com:63721/thinkquant');
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	password: {type: String},
	email: {type: String, index:true},
	name: {type: String},
	type: {type: String}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.createUser =function( newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
			if(err) throw err;
	        newUser.password = hash;
			newUser.save(callback);
	    });
	});
}

module.exports.getUserByEmail = function( username, callback){
	var query = { email: username};
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

module.exports.findOrCreate = function( googleUser, callback){
	var query = { email: googleUser.email};
	User.findOne(query, function(err,user){
		if(err) throw err;
			if(!user){
				//create a user
				console.log("google user was not in database so one was created");
				googleUser.save(callback);
			}else{
				//found a user
				console.log(user);
				console.log("google user was already in database");
				callback(err,user);
			}
	});
}