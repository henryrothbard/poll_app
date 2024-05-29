const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const asyncHandler = require('../utils/asyncHandler');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/app")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));
const userModel = require('../models/user');

// Passport configuration
passport.use(new LocalStrategy(async (username, password, cb) => {
  try {
    const user = await userModel.findOne({username: username});
    if (!user || !(await user.verifyPassword(password))) return cb(null, false);
    return cb(null, user);
  } catch (err) { return cb(err); }
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

// Express router
const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => res.status(204).send());

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.status(204).send();
  });
});

router.post('/register', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username: username });
    if (user) {
        res.status(400).send('User already exists');
        return;
    }
    await userModel.create({ username, password });
    res.status(204).send();
}));

module.exports = router;