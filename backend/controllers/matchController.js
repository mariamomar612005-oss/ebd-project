
const Match = require('../models/Match');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// 1. Get all open matches with optional skill-level filtering
exports.getOpenMatches = async (req, res) => {
  try {
    const filter = { isFull: false };

    if (req.query.skillLevel) {
      filter.skillLevel = req.query.skillLevel;
    }

    const matches = await Match.find(filter)
      .populate('hostId', 'name skillRating')
      .populate('bookingId')
      .populate('joinedPlayers', 'name skillRating');

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Join an open match
exports.joinMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const userId = req.user._id;

    if (match.hostId.toString() === userId.toString()) {
      return res.status(400).json({
        message: 'You cannot join your own match'
      });
    }

    if (match.isFull) {
      return res.status(400).json({
        message: 'This match is already full'
      });
    }

    const alreadyJoined = match.joinedPlayers.some(
      playerId => playerId.toString() === userId.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({
        message: 'You have already joined this match'
      });
    }

    if (match.joinedPlayers.length + 1 >= match.maxPlayers) {
      return res.status(400).json({
        message: 'No available slots in this match'
      });
    }

    match.joinedPlayers.push(userId);

    // Host counts as one player
    match.isFull =
      match.joinedPlayers.length + 1 >= match.maxPlayers;

    await match.save();

    res.status(200).json({
      message: 'Successfully joined the match',
      match
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 3. Create a new open match
exports.createMatch = async (req, res) => {
  try {
    const data = req.body || {};

    // Check required fields
    if (!data.bookingId || typeof data.skillLevel !== 'string' || !data.skillLevel.trim()) {
      return res.status(400).json({
        message: 'bookingId and skillLevel are required'
      });
    }

    // Check that the booking ID is valid
    if (!mongoose.isValidObjectId(data.bookingId)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    // Default to 4 players if maxPlayers is not provided
    const maxPlayers = data.maxPlayers === undefined
      ? 4
      : Number(data.maxPlayers);

    if (!Number.isInteger(maxPlayers) || maxPlayers < 2 || maxPlayers > 4) {
      return res.status(400).json({
        message: 'maxPlayers must be between 2 and 4'
      });
    }

    // Find the booking in the database
    const booking = await Booking.findById(data.bookingId);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    // Make sure the logged-in user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only create a match for your own booking'
      });
    }

    // Create the match in MongoDB
    const match = await Match.create({
      hostId: req.user._id,
      bookingId: booking._id,
      skillLevel: data.skillLevel.trim(),
      maxPlayers: maxPlayers,
      joinedPlayers: [],
      costPerPlayer: Number((booking.totalAmount / maxPlayers).toFixed(2)),
      isFull: false
    });

    res.status(201).json({
      message: 'Open match created successfully',
      match
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};