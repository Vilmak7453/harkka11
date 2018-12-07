"use strict";
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = mongoose.model('User');

passport.use(new LocalStrategy({
  	usernameField: 'email',
  	passwordField: 'password',
	}, 
	(email, password, done) => {
	  	User.findOne({ email: email }, function (err, user) {
		    if (err) { return done(err, false, null); }
		    if (!user) { return done(null, false, 'Email is invalid'); }
		    if (!user.validatePassword(password)) { return done(null, false, 'Password is invalid'); }
		    return done(null, user, null);
		});
  	}
));