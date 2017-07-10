var express = require('express');
var router = express.Router();
var Match = require('../models/match');
var Player = require('../models/match');

router.get('/',function(req, res){
	Match.getMatchLatestData(function(err,match){
		if(err) throw err;
		Player.getPlayerData(match,function(err,data){
			if(err) throw err;
			res.render('game/table',{data:data, title:"Game"});
		});
	});
});


module.exports = router;