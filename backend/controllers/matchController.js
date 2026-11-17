
const Match = require('../models/Match');

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
