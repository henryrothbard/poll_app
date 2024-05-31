require('dotenv').config();
const passport = require('passport');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const logger = require('morgan');

const api = require('./routes/api');
const auth = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: (process.env.MONGO_URI || "mongodb://mongo:27017/app"),
    collectionName: 'sessions'
  })
}));
app.use(passport.authenticate('session'));

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