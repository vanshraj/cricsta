var express = require('express');
var router = express.Router();

router.get('/start',function(req, res, next){
	res.send("start");
	// var exec = require('child_process').exec; 
	// var child = exec('java -jar ./public/simulation.jar',function (error, stdout, stderr){ 
	// console.log('Output -> ' + stdout); 
	// if(error !== null){
	// 	console.log("Error -> "+error); } 
	// });
	// module.exports = child; 
});

router.get('/stop',function(req, res, next){
	res.send("stop");	
});

router.get('/live',function(req, res, next){
	res.send("live");
});

router.get('/prepare',function(req, res, next){
	res.send("prepare");	
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