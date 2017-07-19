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

//gaming routes
module.exports.makeGamingUser = function( match, user, callback){
	if( _.findIndex(user.game, { "gameId": match[0].matchId })== -1){
		//adding todays game in user account
		var game_obj = { "gameId": match[0].matchId, "balance": 1000, "profit": 0, "buy":[], "sell":[] };
		user.game.push(game_obj);
		user.save( function(err, user){
			var i= _.findIndex(user.game, { "gameId": match[0].matchId });
			callback(err, user.game[i]);
		});
	}
	else
	{
		//showing user game account details
		var i= _.findIndex(user.game, { "gameId": match[0].matchId });
		callback(null, user.game[i]);	
	}
}

module.exports.buyStock = function(match, user, stock, callback){
	//buying stocks calculating balance and remaining stocks and profit/loss
	var i= _.findIndex(user.game, { "gameId": match[0].matchId });
	var j= _.findIndex(user.game[i].buy, { "name": stock.name });
	var k= _.findIndex(user.game[i].sell, { "name": stock.name });
	if(k==-1){
		//no selling position so simply buy
		if(j!=-1){
		//already in stock so update stock with average of price
			var quant = user.game[i].buy[j].quantity;
			stock.quantity=parseInt(stock.quantity);
			user.game[i].buy[j].quantity += (stock.quantity);
			user.game[i].buy[j].price = ((quant*user.game[i].buy[j].price)+(stock.price*stock.quantity))/(stock.quantity+quant);
			user.game[i].balance -= stock.price*stock.quantity;
			user.save(function(err, user){
				callback(err, stock);
			});
		}else{
			//buying the stock for first time
			user.game[i].buy.push(stock);
			user.game[i].balance -= stock.price*stock.quantity; 
			user.save(function(err, user){
				callback(err, stock);
			});
		}
	}else{
		//stocks in selling position now make profit or loss
		if(user.game[i].sell[k].quantity > stock.quantity ){
			//reduce stock in sell
			stock.quantity=parseInt(stock.quantity);
			user.game[i].sell[k].quantity -= stock.quantity;
			user.game[i].profit += (user.game[i].sell[k].price*stock.quantity) - (stock.price*stock.quantity);
			user.game[i].balance += 2*(user.game[i].sell[k].price*stock.quantity) - (stock.price*stock.quantity); 
			user.save(function(err, user){
				callback(err, stock);
			});
		}else if(user.game[i].sell[k].quantity < stock.quantity){
			//empty stock in sell and increase stocks in buy
			stock.quantity=parseInt(stock.quantity);

			user.game[i].profit += (user.game[i].sell[k].price*user.game[i].sell[k].quantity) - (stock.price*user.game[i].sell[k].quantity);
			user.game[i].balance += 2*(user.game[i].sell[k].price*user.game[i].sell[k].quantity) - (stock.price*user.game[i].sell[k].quantity);
			
			stock.quantity -= user.game[i].sell[k].quantity;
			user.game[i].balance -= stock.price*stock.quantity; 

			user.game[i].buy.push(stock);
			user.game[i].sell.splice(k, 1);
			user.save(function(err, user){
				callback(err, stock);
			});
		}else{
			//both buy and sell empty
			stock.quantity=parseInt(stock.quantity);

			user.game[i].profit += (user.game[i].sell[k].price*user.game[i].sell[k].quantity) - (stock.price*user.game[i].sell[k].quantity);
			user.game[i].balance += 2*(user.game[i].sell[k].price*user.game[i].sell[k].quantity) - (stock.price*user.game[i].sell[k].quantity);

			user.game[i].sell.splice(k, 1);
			user.save(function(err, user){
				callback(err, stock);
			});
		}
	}
}

module.exports.sellStock = function(match, user, stock, callback){
	//selling stocks, calculating balance and remaining stocks and profit/loss
	var i= _.findIndex(user.game, { "gameId": match[0].matchId });
	var j= _.findIndex(user.game[i].buy, { "name": stock.name });
	var k= _.findIndex(user.game[i].sell, { "name": stock.name });
	if(j==-1){
		//no buying position simply sell stocks
		if(k!=-1){
			//already in sell stocks so update with average price
			var quant = user.game[i].sell[k].quantity;
			stock.quantity=parseInt(stock.quantity);
			user.game[i].sell[k].quantity += (stock.quantity);
			user.game[i].sell[k].price = ((quant*user.game[i].sell[k].price)+(stock.price*stock.quantity))/(stock.quantity+quant);
			user.game[i].balance -= stock.price*stock.quantity;
			user.save(function(err, user){
				callback(err, stock);
			});
		}else{
			//selling the stock for first time
			user.game[i].sell.push(stock);
			user.game[i].balance -= stock.price*stock.quantity; 
			user.save(function(err, user){
				callback(err, stock);
			});
		}

	}else{
		//stocks in buying position now make profit or loss
		if(user.game[i].buy[j].quantity > stock.quantity ){
			//reduce stock in buy
			stock.quantity=parseInt(stock.quantity);
			user.game[i].buy[j].quantity -= stock.quantity;
			user.game[i].profit += (stock.price*stock.quantity) - (user.game[i].buy[j].price*stock.quantity);
			user.game[i].balance += (stock.price*stock.quantity); 
			user.save(function(err, user){
				callback(err, stock);
			});
		}else if(user.game[i].buy[j].quantity < stock.quantity){
			//empty stock in buy and increase stocks in sell
			stock.quantity=parseInt(stock.quantity);

			user.game[i].profit += (stock.price*user.game[i].buy[j].quantity) - (user.game[i].buy[j].price*user.game[i].buy[j].quantity);
			user.game[i].balance += (stock.price*user.game[i].buy[j].quantity);
			
			stock.quantity -= user.game[i].buy[j].quantity;
			user.game[i].balance -= stock.price*stock.quantity; 

			user.game[i].sell.push(stock);
			user.game[i].buy.splice(j, 1);
			user.save(function(err, user){
				callback(err, stock);
			});
		}else{
			//both buy and sell empty
			stock.quantity=parseInt(stock.quantity);

			user.game[i].profit += (stock.price*user.game[i].buy[j].quantity) - (user.game[i].buy[j].price*user.game[i].buy[j].quantity);
			user.game[i].balance += (stock.price*user.game[i].buy[j].quantity);

			user.game[i].buy.splice(j, 1);
			user.save(function(err, user){
				callback(err, stock);
			});
		}
	}
}