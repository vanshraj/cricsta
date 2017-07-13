var express = require('express');
var router = express.Router();
var kill = require('tree-kill');

var child;

router.get('/start',isAdmin, function(req, res, next){
	// res.send("start");
	var exec = require('child_process').exec; 
	child = exec('cd ../Simulation && java -jar Simulation.jar',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout);
	if(error !== null){
		console.log("Error -> "+error); 
		res.send("error occured");
		} 
	});
	res.redirect('/users/account');
	module.exports = child; 
});

router.get('/stop',isAdmin, function(req, res, next){
	kill(child.pid);
	res.redirect('/users/account');
	module.exports = child; 	
});

router.get('/live',isAdmin, function(req, res, next){
	var exec = require('child_process').exec; 
	var child = exec('python ../Simulation/dump_live.py',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	module.exports = child; 
});

router.get('/prepare',isAdmin, function(req, res, next){
	var exec = require('child_process').exec; 
	var child = exec('java -jar ../Simulation/Prepare.jar',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	module.exports = child; 	
});



function isAdmin(req, res, next) {
	if(req.isAuthenticated())
		if(req.user.type=='admin')
			return next();
    else{
	    req.flash('error','You Are Not Authorised')
    	res.redirect('/users/login');	
    }
}

module.exports = router;