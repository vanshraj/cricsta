var express = require('express');
var router = express.Router();
var Match = require('../models/match');
var Post = require('../models/post');
var Player = require('../models/match');

router.get('/', function(req, res, next){
	res.render('index/home', {title: 'Thinkquant'});
});

// GET prediction page.
router.get('/prediction', function(req, res, next) {
	Post.getNFeaturedPosts(2,function(err, featuredPosts){
		if(err) throw err;
		Post.getAllPosts(function(err, posts){
			if(err) throw err;
			res.render('index/prediction', { title: 'Prediction', posts:posts ,featuredPosts: featuredPosts });
		});
	});
});

//about pages
// router.get('/about/model',function(req, res){
// 	res.render('index/about',{title: 'About Model'});
// });

router.get('/about',function(req, res){
	res.render('index/about',{title:'About Us'});
});

router.get('/what_we_do',function(req, res){
	res.render('index/what',{title:'What We Do'});
});

//ajax routes for json response
//live response
router.post('/matchData',function(req,res){
	if(req.isAuthenticated()){
		if(req.user.type=='premium'||req.user.type=='admin'){
			// console.log("user is premium");
			Match.getMatchLatestData(function(err,match){
				if(err) throw err;
				res.send(match[0]);
			});
		}else{
			// console.log("user is loggedin but not premium");
			Match.getMatchDataOne(function(err,match){
				if(err) throw err;
				res.send(match[0]);
			});
		}
	}else{
		// console.log("user not logged in");
		Match.getMatchDataFive(function(err,match){
			if(err) throw err;
			res.send(match[0]);
		});	
	}
});

//starting probs response
router.post('/matchDataProb',function(req,res){
	Match.getMatchLatestData(function(err,match){
		if(err) throw err;
		Match.getMatchAllProb(match,function(err,probs){
			if(err) throw err;
			res.send(probs);
		});
	});
});

//player data response
router.post('/playerData',function(req, res){
	Match.getMatchLatestData(function(err,match){
		if(err) throw err;
		Player.getPlayerData(match,function(err,data){
			if(err) throw err;
			res.send(data);
		});
	});
});

module.exports = router;