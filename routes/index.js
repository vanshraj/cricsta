var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var exec = require('child_process').exec;
	var child = exec('java -jar ./public/simulation.jar',function (error, stdout, stderr){
	    console.log('Output -> ' + stdout);
	    if(error !== null){
	    	console.log("Error -> "+error);
	    }
	});
	 
	module.exports = child;
	res.render('index', { title: 'ThinkQuant' });
});

module.exports = router;
