const mongoose = require('mongoose');
const Review = require('../models/Review');
const User = require('../models/User');

const SCORE_FORMAT = /^\d+\s*[-–]\s*\d+(\s*,\s*\d+\s*[-–]\s*\d+)*$/;

exports.getPlayers = async (req, res) => {
  try {
    const players = await User.find({ _id: { $ne: req.user._id } }).select('name skillRating role');
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { targetUserId, rating, scoreLogged, comment } = req.body;
    if (!targetUserId || rating === undefined) {
      return res.status(400).json({ message: 'Choose a player and give a star rating' });
    }
    if (!mongoose.isValidObjectId(targetUserId)) {
      return res.status(400).json({ message: 'Invalid player' });
    }
    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number from 1 to 5' });
    }
    if (String(targetUserId) === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot rate yourself' });
    }
    if (scoreLogged && !SCORE_FORMAT.test(scoreLogged.trim())) {
      return res.status(400).json({ message: 'Score format example: 6-4, 6-2' });
    }
    const target = await User.findById(targetUserId);
    if (!target) return res.status(404).json({ message: 'Player not found' });

    const review = await Review.create({
      reviewerId: req.user._id,
      targetUserId: target._id,
      rating: stars,
      scoreLogged: scoreLogged ? scoreLogged.trim() : undefined,
      comment: comment ? comment.trim() : undefined,
    });

    const agg = await Review.aggregate([
      { $match: { targetUserId: target._id } },
      { $group: { _id: null, avg: { $avg: '$rating' } } },
    ]);
    const skillRating = Math.round(agg[0].avg * 10) / 10;
    await User.findByIdAndUpdate(target._id, { skillRating });

    res.status(201).json({ review, skillRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReceived = async (req, res) => {
  try {
    const reviews = await Review.find({ targetUserId: req.user._id })
      .populate('reviewerId', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
