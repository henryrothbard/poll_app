const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/user');

// Local authentication strategy using username and password
passport.use(new LocalStrategy((username, password, done) => {
  userModel.findOne({ username: username }).then((user) => {
    if (!user || !user.verifyPassword(password)) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    return done(null, user);
  }).catch(err => done(err));
}));

// Google OAuth 2.0 strategy for authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback" // Google will send responses to this route
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOrCreate({ googleId: profile.id }).then((user) => cb(user));
  }
));

// Serialize user to the session
passport.serializeUser((user, done) => done(null, user.id));

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  userModel.findById(id).then((user) => done(user));
});