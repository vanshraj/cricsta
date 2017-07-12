var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var configAuth = require('./auth');

//passport middleware
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

//passport google strategy
passport.use(new GoogleStrategy({
    clientID: configAuth.googleAuth.clientID,
    clientSecret: configAuth.googleAuth.clientSecret,
    callbackURL: configAuth.googleAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  	var googleUser = new User({
		email: profile.emails[0].value ,
		name: profile.name.givenName+' '+ profile.name.familyName,
		type: 'google' 
	});
    User.findOrCreate( googleUser, function (err, user) {
      return done(err, user);
    });
  }
));

//passport facebook strategy
passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL,
	profileFields: ['id','emails','name','verified'],
  },
  function(accessToken, refreshToken, profile, done) {
  	var facebookUser = new User({
		email: profile.emails[0].value ,
		name: profile.name.givenName +' '+ profile.name.familyName,
		type: 'facebook' 
	});
    User.findOrCreate( facebookUser, function (err, user) {
      return done(err, user);
    });
  }
));

//passport local strategy
passport.use( new LocalStrategy({usernameField: 'email',
    passwordField: 'password',
    session: false
  },
	function(username, password, done){
		User.getUserByEmail(username, function(err, user){
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

module.exports = passport;