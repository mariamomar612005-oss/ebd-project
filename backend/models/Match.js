const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  venue: { type: String, required: true, trim: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  durationMinutes: { type: Number, default: 90 },
  skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'any'], default: 'any' },
  maxPlayers: { type: Number, required: true, min: 2 },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  totalCost: { type: Number, required: true, min: 0 },
  costPerPlayer: { type: Number },
  notes: { type: String },
  status: { type: String, enum: ['open', 'full', 'cancelled'], default: 'open' },
}, { timestamps: true });

matchSchema.pre('save', function (next) {
  this.costPerPlayer = Math.round((this.totalCost / this.maxPlayers) * 100) / 100;
  if (this.status !== 'cancelled') {
    this.status = this.players.length >= this.maxPlayers ? 'full' : 'open';
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema);
