const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const asyncHandler = require('../utils/asyncHandler');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/app")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));
const userModel = require('../models/user');

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,64}$/;
const userRegex = /^[a-z0-9._-]{3,26}$/;

// Passport configuration
passport.use(new LocalStrategy(async (username, password, cb) => {
  try {
    const user = await userModel.findOne({username: username.toLowerCase()});
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
    const username = req.body.username.toLowerCase();
    const password = req.body.password;

    if (!userRegex.test(username)) {
        res.status(400).send('Invalid Username');
        return;
    }
    if (!passRegex.test(password)) {
        res.status(400).send('Invalid Password');
        return;
    }
    const user = await userModel.findOne({ username: username });
    if (user) {
        res.status(400).send('User already exists');
        return;
    }
    await userModel.create({ username, password });
    res.status(200).send({username, password});
}));

function authenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).send('Unauthorized');
}

router.get('/test', authenticate, (req, res) => res.send('Authenticated:', req.user));

module.exports = router;