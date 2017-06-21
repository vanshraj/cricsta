var express = require('express');
var router = express.Router();
var Match = require('../models/match');

// GET home page.
router.get('/', function(req, res, next) {
	res.render('index/index', { title: 'ThinkQuant' });
});


//about route
router.get('/about',function(req,res){
	res.render('index/about',{
		title:'About'
	})
});

//pricing route
router.get('/pricing',function(req,res){
	res.render('index/pricing',{
		title:'Pricing'
	})
});

//ajax routes for json response
router.get('/matchData', isPremium);

function isPremium(req,res,next){
	if(req.isAuthenticated()){
		if(req.user.type=='premium'){
			console.log("user is premium");
			Match.getMatchLatestData(function(err,match){
				if(err) throw err;
				res.send(match[0]);
			});
		}else{
			console.log("user is loggedin but not premium");
			Match.getMatchData(function(err,match){
				if(err) throw err;
				res.send(match[0]);
			});
		}
	}else{
		console.log("user not logged in");
		Match.getMatchData(function(err,match){
			if(err) throw err;
			res.send(match[0]);
		});	
	}	
}


module.exports = router;
