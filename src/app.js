require('dotenv').config();
require('./configs/passport-config');
const passport = require('passport');
const session = require('express-session');
const express = require('express');
const app = express();
const api = require('./routes/api')
const auth = require('./routes/auth')
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);
app.use('/auth', auth);

app.use((req, res, next) => {
    res.status(404).send("Sorry, can't find that!");
});

app.use((err, req, res, next) => {
    console.error("500 ERROR: ", err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});