var express = require('express');
var router = express.Router();
var Match = require('../models/match');
var Player = require('../models/match');
var User = require('../models/user');
var jsonfile = require('jsonfile')
var file = '../cricbuzz/data.json'
var _ = require('lodash');
var nodemailer = require('nodemailer'); 

//nodemailer transporter
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.USERPASS
  }
});


router.get('/',isAuthenticated, function(req, res){
	Match.getMatchLatestData(function(err, match){
		if(err) throw err;
		if( _.findIndex(req.user.game, { "gameId": match[0].matchId })== -1){
			res.redirect('/game/account');
		}
		else{
			User.makeGamingUser(match, req.user, function(err, user_data, alluser){
			if(err) throw err;
				Player.getPlayerData(match, function(err, data){
					if(err) throw err;
					var team1players = _.unionBy( data.team1.bowlers,data.team1.batsmen, 'name');
					team1players = _.sortBy(team1players,'name');
					var team2players = _.unionBy( data.team2.bowlers,data.team2.batsmen,'name');
					team2players = _.sortBy(team2players,'name');
					var tenuser=[];
					for(var i=0;i<alluser.length;i++){
						if(_.findIndex(alluser[i].game, { "gameId": match[0].matchId })!= -1){

							var j=_.findIndex(alluser[i].game, { "gameId": match[0].matchId });

							tenuser.push({"name":alluser[i].name, "balance": alluser[i].game[j].balance,"buy":alluser[i].game[j].buy});
						}
					}
					res.render('game/table',{ alluser: tenuser, user_data:user_data, data:data, team2players:team2players, team1players:team1players, title:"Game", overs:match[0].totalOver});
				});
			});	
		}	
    });
});

router.get('/account',isAuthenticated, function(req, res){
	Match.getMatchLatestData(function(err, match){
		if(err) throw err;
		Player.getPlayerData(match, function(err, data){
			if(err) throw err;
			res.render('game/game_account',{ data:data});
		});
    });
});
router.post('/account',isAuthenticated, function(req, res){
	Match.getMatchLatestData(function(err, match){
		if(err) throw err;
		Player.getPlayerData(match, function(err, data){
			if(err) throw err;
			res.send(data.start);
		});
    });
});

router.post('/',isAuthenticated, function(req, res){
	Match.getMatchLatestData(function(err, match){
		if(err) throw err;
		if( _.findIndex(req.user.game, { "gameId": match[0].matchId })!= -1){
			req.flash('success','You are already playing this contest!');
			res.location('/game');
			res.redirect('/game');
		}else if(req.user.type!="premium"&&req.user.type!="admin"&&req.user.balance<100){
			req.flash('error',"You don't have the required balance!");
			res.location('/game/account');
			res.redirect('/game/account');
		}
		else{
			User.makeGamingUser(match, req.user, function(err, user_data, alluser){
				if(err) throw err;
			});
			req.flash('success','You have successfully joined this contest!');
			res.location('/game');
			res.redirect('/game');	
		}	
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
		var transfer,balls,notstart=false,end1=false,end2=false;
		
		if(match[0].team2.over<0.1){
			balls=6-(match[0].team1.over%1)*10;
			if(match[0].team1.over%1!=0&&match[0].team1.wickets!=10){
				transfer=false;
			}
			else{
				if(match[0].team1.over==match[0].totalOver||match[0].team1.wickets==10)
					end1=true;
				transfer=true;
			}
		}
		else{
			if(match[0].team2.over==match[0].totalOver||match[0].team2.wickets==10||match[0].team2.actualScore>match[0].team1.actualScore)
				end2=true;
			balls=6-(match[0].team2.over%1)*10;
			if(match[0].team2.over%1!=0||end2){
				transfer=false;
			}
			else{
				transfer=true;
			}
		}
		if(match[0].team1.over<0.1){
			notstart=true;
			transfer=true;
		}
		Player.getPlayerData(match, function(err, data){
			if(err) throw err;
			var team1players = _.unionBy( data.team1.bowlers,data.team1.batsmen, 'name');
			team1players = _.sortBy(team1players,'name');
			var team2players = _.unionBy( data.team2.bowlers,data.team2.batsmen,'name');
			team2players = _.sortBy(team2players,'name');
			var data ={ team2players:team2players, team1players:team1players, transfer:transfer, timestamp:match[0].date, balls:balls,notstart:notstart,end2:end2,end1:end1 };
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

router.post('/feedback',isAuthenticated,function(req, res, next){
	var mailOptions = {
	  from: req.user.email,
	  to: 'alok.noronha@gmail.com, vanshajbehl96@gmail.com',
	  subject: 'Pro Sports League Feedback. From: '+req.user.email,
	  text: req.body.feed
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log(error);
		res.redirect('/game');
	  } else {
		res.redirect('/game');
	    console.log('Email sent: ' + info.response);
	  }
	});
});


//login middleware
function isAuthenticated(req, res, next) {
	if(req.isAuthenticated())
        return next();
    else{
    	req.session.redirectTo ="/game"+ req.url;
	    req.flash('error','Please Login First')
    	res.redirect('/users/login');	
    }
}

module.exports = router;