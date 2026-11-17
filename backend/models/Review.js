const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  scoreLogged: { type: String },
  comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
