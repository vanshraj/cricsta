var express = require('express');
var router = express.Router();
var Match = require('../models/match');
var Player = require('../models/match');
var User = require('../models/user');
var _ = require('lodash');

router.get('/', function(req, res){
	if(req.isAuthenticated()){
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
	}   
    else{
	    Match.getMatchLatestData(function(err,match){
			if(err) throw err;
			Player.getPlayerData(match,function(err,data){
				if(err) throw err;
				var team1players = _.unionBy( data.team1.bowlers,data.team1.batsmen, 'name');
				team1players = _.sortBy(team1players,'name');
				var team2players = _.unionBy( data.team2.bowlers,data.team2.batsmen,'name');
				team2players = _.sortBy(team2players,'name');
				res.render('game/table',{ data:data, team2players:team2players, team1players:team1players, title:"Game"});
			});
		});	
    }
});

//buy players
router.post('/buy',isAuthenticated, function(req, res, next){
	res.send(req.body);
});

//sell players
router.post('/sell',isAuthenticated, function(req, res, next){
	res.send(req.body);
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