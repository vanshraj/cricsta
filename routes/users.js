var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('../config/passport')

/* Register routes*/
router.get('/register',isAuthenticated2, function(req, res, next) {
  res.render('user/register',{
  	title:'signup'
  });
});

router.post('/register', isAuthenticated2,function(req, res, next){
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
router.get('/login',isAuthenticated2, function(req, res, next) {
  res.render('user/login',{
  	title:'login'
  });
});

router.post('/login',isAuthenticated2, passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid Email Id or Password'}),function(req,res){
	console.log('Authentication Successful');
	var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
	delete req.session.redirectTo;
	res.redirect(redirectTo);
});

router.get('/auth/google',isAuthenticated2,passport.authenticate('google', { scope: ['email profile'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'users/login', failureFlash:'Authentication Unsuccessful.' }),
  function(req, res) {
    console.log('Authentication Successful');
	var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
	delete req.session.redirectTo;
	res.redirect(redirectTo);
 });

router.get('/auth/facebook',isAuthenticated2,passport.authenticate('facebook', {scope: 'email'}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'users/login', failureFlash:'Authentication Unsuccessful.' }),
  function(req, res) {
    console.log('Authentication Successful');
	var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
	delete req.session.redirectTo;
	res.redirect(redirectTo);
 });

//logout route
router.get('/logout',isAuthenticated,function(req,res){
	var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
	delete req.session.redirectTo;
	req.session.destroy(function (err) {
		res.redirect(redirectTo);
	});
});

//acount route
router.get('/account',isAuthenticated,function(req,res){
	if(req.user.type=='admin'){
		res.render('user/admin',{
			title:'Account'
		});
	}
	else{
		res.render('user/account',{
			title:'Account'
		});
	}
});

function isAuthenticated(req, res, next) {
	if(req.isAuthenticated())
        return next();
    else{
    	req.session.redirectTo = "/users"+req.url;
	    req.flash('error','Please Login First');
    	res.redirect('/users/login');	
    } 
}

function isAuthenticated2(req, res, next) {
	if(req.isAuthenticated()){
    	req.flash('info','You are already logged in.');
		res.redirect('/');	
	}
	else
    	return next();
}

module.exports = router;