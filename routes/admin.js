var express = require('express');
var router = express.Router();

router.get('/start',function(req, res, next){
	// res.send("start");
	var exec = require('child_process').exec; 
	var child = exec('java -jar ../Simulation/simulation.jar',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	module.exports = child; 
});

router.get('/stop',function(req, res, next){
	var exec = require('child_process').exec; 
	var child = exec('',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	module.exports = child; 	
});

router.get('/live',function(req, res, next){
	var exec = require('child_process').exec; 
	var child = exec('python ../Simulation/dump_live.py',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	module.exports = child; 
});

router.get('/prepare',function(req, res, next){
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