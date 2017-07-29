var express = require('express');
var router = express.Router();
var Match = require('../models/match');
var Player = require('../models/match');
var User = require('../models/user');
var jsonfile = require('jsonfile')
var file = '../cricbuzz/data.json'
var _ = require('lodash');

router.get('/',isAuthenticated, function(req, res){
	Match.getMatchLatestData(function(err, match){
		if(err) throw err;
		User.makeGamingUser(match, req.user, function(err, user_data){
			if(err) throw err;
			Player.getPlayerData(match, function(err, data){
				if(err) throw err;
				var team1players = _.unionBy( data.team1.bowlers,data.team1.batsmen, 'name');
				team1players = _.sortBy(team1players,'name');
				var team2players = _.unionBy( data.team2.bowlers,data.team2.batsmen,'name');
				team2players = _.sortBy(team2players,'name');
				res.render('game/table',{ user_data:user_data, data:data, team2players:team2players, team1players:team1players, title:"Game"});
			});
		});
    });
});

//buy players
router.post('/buy',isAuthenticated, function(req, res, next){
	Match.getMatchLatestData(function(err,match){
		if(err) throw err;
		User.buyStock(match, req.user, req.body, function(err, data){
			if(err) throw err;
			res.send(data);
		});
	});
});

//sell players
router.post('/sell',isAuthenticated, function(req, res, next){
	Match.getMatchLatestData(function(err,match){
		if(err) throw err;
		User.sellStock(match, req.user, req.body, function(err, data){
			if(err) throw err;
			res.send(data);
		});
	});
});

// give player data from python file and users buying/selling positions
router.get('/player', function(req, res, next){
	Match.getMatchLatestData(function(err, match){
		if(err) throw err;
		Player.getPlayerData(match, function(err, data){
			if(err) throw err;
			var team1players = _.unionBy( data.team1.bowlers,data.team1.batsmen, 'name');
			team1players = _.sortBy(team1players,'name');
			var team2players = _.unionBy( data.team2.bowlers,data.team2.batsmen,'name');
			team2players = _.sortBy(team2players,'name');
			var data ={ team2players:team2players, team1players:team1players };
			res.send(data);
		});
	});
});

//give user specific game data
router.post('/user', function(req, res, next){
	if(req.isAuthenticated()){
		Match.getMatchLatestData(function(err, match){
			if(err) throw err;
			User.makeGamingUser(match, req.user, function(err, user_data){
				if(err) throw err;
				res.send(user_data);
			});
		});
	}else{
		var obj = { "name":true};
		res.send(obj);
	}
});

//login middleware
function isAuthenticated(req, res, next) {
	if(req.isAuthenticated())
        return next();
    else{
	    req.flash('error','Please Login First')
    	res.redirect('/users/login');	
    }
}

module.exports = router;