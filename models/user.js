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
	balance:{type: Number, default: 200},
	game: [ { gameId: {type: String}, balance: {type: Number}, profit: {type: Number}, buy:[ { name:{ type: String}, price:{ type: Number}, quantity:{ type: Number} } ], sell:[ { name:{ type: String}, price:{ type: Number}, quantity:{ type: Number}, buyprice:{ type: Number} } ] } ]
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
		if(user.type!='premium'&&user.type!='admin')
			user.balance-=100;
		if(match[0].totalOver==20)
			var game_obj = { "gameId": match[0].matchId, "balance": 300, "profit": 0, "buy":[], "sell":[] };
		else
			var game_obj = { "gameId": match[0].matchId, "balance": 500, "profit": 0, "buy":[], "sell":[] };
		user.game.push(game_obj);
		user.save( function(err, user){
			var i= _.findIndex(user.game, { "gameId": match[0].matchId });
			User.find({}, function(err, alluser){
				callback(null, user.game[i], alluser);
			});
		});
	}
	else
	{
		//showing user game account details
		var i= _.findIndex(user.game, { "gameId": match[0].matchId });
		User.find({}, function(err, alluser){
			callback(null, user.game[i], alluser);
		});
	}
}

module.exports.buyStock = function(match, user, stock, callback){
	//buying stocks calculating balance and remaining stocks and profit/loss
	var i= _.findIndex(user.game, { "gameId": match[0].matchId });
	var j= _.findIndex(user.game[i].buy, { "name": stock.name });

	//simply buy the stock
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
	}
	else{
			//buying the stock for first time
			user.game[i].buy.push(stock);
			user.game[i].balance -= stock.price*stock.quantity; 
			user.save(function(err, user){
				callback(err, stock);
			});
	}
}

module.exports.sellStock = function(match, user, stock, callback){
	//selling stocks, calculating balance and remaining stocks and profit/loss
	var i= _.findIndex(user.game, { "gameId": match[0].matchId });
	var j= _.findIndex(user.game[i].buy, { "name": stock.name });
	var k= _.findIndex(user.game[i].sell, { "name": stock.name });

	if(j==-1){
		//send error no stocks to sell
	}
	else{
		if(user.game[i].buy[j].quantity > stock.quantity ){
			//reduce stock in buy and add closed position
			stock.quantity=parseInt(stock.quantity);

			if(k==-1){
				//first time selling so new closed positions
				user.game[i].sell.push(stock);
			}
			else{
				//making closed positions average
				var quant = user.game[i].sell[k].quantity;
				user.game[i].sell[k].price = ((quant*user.game[i].sell[k].price)+(stock.quantity*stock.price))/(quant+stock.quantity);
				user.game[i].sell[k].buyprice = ((quant*user.game[i].sell[k].buyprice)+(stock.quantity*stock.buyprice))/(quant+stock.quantity);
				user.game[i].sell[k].quantity += stock.quantity;
			}
			user.game[i].buy[j].quantity -= stock.quantity;
			user.game[i].profit += (stock.price*stock.quantity) - (user.game[i].buy[j].price*stock.quantity);
			user.game[i].balance += stock.price*stock.quantity;
			user.save(function(err, user){
				callback(err, stock);
			});
		}
		else if(user.game[i].buy[j].quantity < stock.quantity){
			//send error selling qty more than bought
		}
		else{
			//sell all the stocks
			stock.quantity=parseInt(stock.quantity);

			if(k==-1){
				//first time selling so new closed positions
				user.game[i].sell.push(stock);
			}
			else{
				//making closed postions average
				var quant = user.game[i].sell[k].quantity;
				user.game[i].sell[k].price = ((quant*user.game[i].sell[k].price)+(stock.quantity*stock.price))/(quant+stock.quantity);
				user.game[i].sell[k].buyprice = ((quant*user.game[i].sell[k].buyprice)+(stock.quantity*stock.buyprice))/(quant+stock.quantity);
				user.game[i].sell[k].quantity += stock.quantity;
			}

			user.game[i].profit += (stock.price*stock.quantity) - (user.game[i].buy[j].price*stock.quantity);
			user.game[i].balance += stock.price*stock.quantity;

			user.game[i].buy.splice(j, 1);
			user.save(function(err, user){
				callback(err, stock);
			});
		}
	}
}