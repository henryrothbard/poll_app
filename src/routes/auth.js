const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/app")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));
const userModel = require('../models/user');

const express = require('express');
const passport = require('passport');
const localStrategy = require('passport-local');

passport.use(new LocalStrategy((username, password, done) => {
    userModel.findOne({ username: username }).then((user) => {
      if (!user || !user.verifyPassword(password)) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }
      return done(null, user);
    }).catch(err => {return done(err)});
}));






router.post('/register', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const usr = await userModel.findOne({ username: username });
    if (usr) {
        res.status(400).send('User already exists');
        return;
    }
    await userModel.create({ username, password });
    res.send('Created Profile!');
}));

module.exports = router;