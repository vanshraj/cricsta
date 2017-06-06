var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register',{
  	title:'signup'
  });
});

router.get('/login', function(req, res, next) {
  res.render('login',{
  	title:'login'
  });
});

router.post('/register', function(req, res, next){
	var name = req.body.name;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;
	
	User.getUserByUsername(username,function(err,user){
		if(err) throw err;

		if(user){
			var errors=[];
			errors.push({ msg: 'Username already exists'});
			console.log(errors);
		}

		if(errors){
		res.render('register',{
			title:'signup',
			errors: errors,
			name: name,
			email: email,
			username: username,
			password: password,
			password2: password2
		});
		}	
		 else
		{
			var newUser = new User({
				name: name,
				email: email,
				username: username,
				password: password,
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

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});
//passport local strategy
passport.use( new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				console.log('Unknown User');
				return done(null, false, {message: 'Unknown User'});
			}
			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				}else{
					console.log('Invalid Password');
					return done(null, false, {message: 'Invalid Password'});
				}
			});
		});
	}
));

router.post('/login', passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid Username or Password'}),function(req,res){
	console.log('Authentication Successful');
	req.flash('success','You are logged in');
	res.redirect('/');
});

router.get('/logout',function(req,res){
	req.logout();
	req.flash('success','You have logged out');
	res.redirect('/users/login');
});


module.exports = router;