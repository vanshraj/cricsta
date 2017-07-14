var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

var childpid="";
var pythonpid="";

router.get('/start',isAdmin, function(req, res, next){
	if(childpid==""){
		var child = exec('cd ../Simulation && java -jar Simulation.jar');
		var child2 = exec('cd ../Simulation && python dump_live.py');
		childpid=child.pid+2;
		pythonpid=child2.pid+2;
		req.flash('success','process started.');
		res.redirect('/users/account');
	}else{
		req.flash('error','Already running simulation stop first');
	    	res.redirect('/users/account');
	}
});

router.get('/stop',isAdmin, function(req, res, next){
	if(childpid==""){
		req.flash('error','There is no process started.');
    		res.redirect('/users/account');
	}else{
		console.log(childpid);
		var child = exec('kill '+childpid, function(){
			childpid="";
			var child2 = exec('kill '+pythonpid, function(){
				pythonpid="";
				req.flash('success','process killed.');
				res.redirect('/users/account');
			});	
		});
	}
});

router.get('/prepare',isAdmin, function(req, res, next){
	var child = exec('cd ../Simulation && java -jar Prepare.jar',function(error,stdout){
		console.log("output - > "+stdout);
	});
	req.flash('success','prepare started.');
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