const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    creator: { type: String, required: true },
    anonymous: Boolean,
    question: { type: String, required: true },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    votes: { type: Map, of: Number, default: () => new Map([['yes', 0], ['no', 0]])},
});

UserSchema.methods.verifyPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('Question', QuestionSchema);