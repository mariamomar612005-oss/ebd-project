
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  skillLevel: {
    type: String,
    required: true
  },
  maxPlayers: {
    type: Number,
    default: 4
  },
  joinedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  costPerPlayer: {
    type: Number,
    required: true
  },
  isFull: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
