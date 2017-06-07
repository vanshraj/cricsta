var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('../config/passport')

/* Register routes*/
router.get('/register', function(req, res, next) {
  res.render('register',{
  	title:'signup'
  });
});

router.post('/register', function(req, res, next){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	
	User.getUserByEmail(email,function(err,user){
		if(err) throw err;

		if(user){
			var errors=[];
			errors.push({ msg: 'Email already exists'});
			console.log(errors);
		}

		if(errors){
		res.render('register',{
			title:'signup',
			errors: errors,
			name: name,
			email: email,
			password: password,
			password2: password2
		});
		}	
		 else
		{
			//creating a local user
			var newUser = new User({
				name: name,
				email: email,
				password: password,
				type: 'local'
			});
			//create user
			User.createUser(newUser, function(err, user){
				if(err) throw err;
				console.log(user);
			});

			//Success message
			req.flash('success','You are now registered and may log in');
			res.location('/users/login');
			res.redirect('/users/login');
		}

	});
});

//Login Routes
router.get('/login', function(req, res, next) {
  res.render('login',{
  	title:'login'
  });
});

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid Email Id or Password'}),function(req,res){
	console.log('Authentication Successful');
	req.flash('success','You are logged in');
	res.redirect('/');
});

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/login');
});

router.get('/auth/google',passport.authenticate('google', { scope: ['email profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'users/login', failureFlash:'Authentication Unsuccessful.' }),
  function(req, res) {
    console.log('Authentication Successful');
	req.flash('success','You are logged in via google');
	res.redirect('/');
  });


module.exports = router;