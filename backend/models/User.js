const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  role: { type: String, enum: ['player', 'owner'], default: 'player' },
  skillRating: { type: Number, default: 3.0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
