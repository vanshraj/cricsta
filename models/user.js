var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect(process.env.DATABASEURL);
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
	if(hash){
		bcrypt.compare(candidatePassword, hash, function(err, res) {
			if(err) throw err;
			callback(null, res);
		});	
	}else{
		callback(null, false);
	}
	
}

module.exports.findOrCreate = function( socialUser, callback){
	var query = { email: socialUser.email};
	User.findOne(query, function(err,user){
		if(err) throw err;
			if(!user){
				//create a user
				console.log("social user was not in database so one was created");
				socialUser.save(callback);
			}else{
				//found a user
				console.log(user);
				console.log("social user was already in database");
				callback(null,user);
			}
	});
}