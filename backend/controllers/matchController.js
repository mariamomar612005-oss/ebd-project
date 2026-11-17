const Match = require('../models/Match');

const FIELDS = ['title', 'venue', 'date', 'startTime', 'durationMinutes',
  'skillLevel', 'maxPlayers', 'totalCost', 'notes'];

const userId = (req) => String(req.user._id || req.user.id);

exports.createMatch = async (req, res) => {
  try {
    const { title, venue, date, startTime, maxPlayers, totalCost } = req.body;
    if (!title || !venue || !date || !startTime || !maxPlayers || totalCost === undefined) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    const data = {};
    FIELDS.forEach((f) => { if (req.body[f] !== undefined) data[f] = req.body[f]; });
    const match = await Match.create({ ...data, host: userId(req), players: [userId(req)] });
    res.status(201).json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyMatches = async (req, res) => {
  try {
    const matches = await Match.find({ host: userId(req) }).sort({ date: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (String(match.host) !== userId(req)) {
      return res.status(403).json({ message: 'Only the host can edit this match' });
    }
    if (req.body.maxPlayers !== undefined && req.body.maxPlayers < match.players.length) {
      return res.status(400).json({ message: 'maxPlayers cannot be less than players already joined' });
    }
    FIELDS.forEach((f) => { if (req.body[f] !== undefined) match[f] = req.body[f]; });
    await match.save();
    res.json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.cancelMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    if (String(match.host) !== userId(req)) {
      return res.status(403).json({ message: 'Only the host can cancel this match' });
    }
    match.status = 'cancelled';
    await match.save();
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
