var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.connect(process.env.DATABASEURL);
var db = mongoose.connection;
var _ = require('lodash');

// User Schema
var UserSchema = mongoose.Schema({
	password: {type: String},
	email: {type: String, index:true},
	name: {type: String},
	type: {type: String},
	game: [ { gameId: {type: String}, balance: {type: Number}, profit: {type: Number}, buy:[ { name:{ type: String}, price:{ type: Number}, quantity:{ type: Number} } ], sell:[ { name:{ type: String}, price:{ type: Number}, quantity:{ type: Number} } ] } ]
});

var User = mongoose.model('User', UserSchema);

module.exports = User;

module.exports.makeGamingUser = function( match, user, callback){
	if( _.findIndex(user.game, { "gameId": match[0].matchId })== -1){
		console.log("if gameid not found then update user");
		User.findOne({ email: user.email}, function(err, user){
			if(err) throw err;
			var game_obj = { "gameId": match[0].matchId, "balance": 1000, "profit": 0, "buy":[], "sell":[] };
			user.game.push(game_obj);
			user.save( function(err, user){
				// console.log("updated user -->"+ user);
				var i= _.findIndex(user.game, { "gameId": match[0].matchId });
				// console.log("current game index --> "+i);
				// console.log("current game user_data --> "+user.game[i]);
				callback(null, user.game[i]);
			});
		});
	}
	else
	{
		console.log("user already has the gameid");
		var i= _.findIndex(user.game, { "gameId": match[0].matchId });
		// console.log("current game index --> "+i);
		// console.log("current game user_data --> "+user.game[i]);
		callback(null, user.game[i]);	
	}
}

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