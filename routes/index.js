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
router.get('/matchData',function(req,res){
	Match.getMatchData(function(err,match){
		if(err) throw err;
		res.send(match[0]);
	});
});

module.exports = router;
