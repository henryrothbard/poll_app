const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI || "mongodb://mongo:27017/app")
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error(err));
//const questionModel = require('../models/question');
const userModel = require('../models/user');

const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');

router.post('/post_question', asyncHandler(async (req, res) => {
    res.status(204);
}));

router.get('/question/:id', asyncHandler(async (req, res) => {
    res.status(204);
}));

router.post('/question/:id/vote', asyncHandler(async (req, res) => {
    res.status(204);
}));

module.exports = router;