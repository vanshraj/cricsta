var express = require('express');
var router = express.Router();

var childpid="";

router.get('/start',isAdmin, function(req, res, next){
	if(childpid==""){
		var exec = require('child_process').exec; 
		var child = exec('cd ../Simulation && java -jar Simulation.jar',function (error, stdout, stderr){ 
		console.log('Output -> ' + stdout);
		if(error !== null){
			console.log("Error -> "+error); 
			res.send("error occured");
			} 
		});
		childpid=child.pid;
		res.redirect('/users/account');
	}else{
		req.flash('error','Already running simulation stop first');
    	res.redirect('/users/account');
	}
});

router.get('/stop',isAdmin, function(req, res, next){
	if(childpid==""){
		req.flash('error','There is no child');
    	res.redirect('/users/account');
	}else{
		var exec = require('child_process').exec; 
		var child = exec('kill '+childpid,function (error, stdout, stderr){
		childpid="" 
		console.log('Output -> ' + stdout);
		if(error !== null){
			console.log("Error -> "+error); 
			res.send("error occured");
			} 
		});
		res.redirect('/users/account');
	}
});

router.get('/live',isAdmin, function(req, res, next){
	var exec = require('child_process').exec; 
	var child = exec('cd ../Simulation && python dump_live.py',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	res.redirect('/users/account');
});

router.get('/prepare',isAdmin, function(req, res, next){
	var exec = require('child_process').exec; 
	var child = exec('cd ../Simulation && java -jar Prepare.jar',function (error, stdout, stderr){ 
	console.log('Output -> ' + stdout); 
	if(error !== null){
		console.log("Error -> "+error); } 
	});
	res.redirect('/users/account');	
});



function isAdmin(req, res, next) {
	if(req.isAuthenticated())
		if(req.user.type=='admin')
			return next();
		else{
	    req.flash('error','You Are Not Authorised');
    	res.redirect('/users/login');	
    }
    else{
	    req.flash('error','You Are Not Authorised');
    	res.redirect('/users/login');	
    }
    req.flash('error','You Are Not Authorised');
    res.redirect('/users/login');
}

module.exports = router;