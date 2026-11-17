const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  skillRating: user.skillRating,
});

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (await User.findOne({ email })) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role === 'owner' ? 'owner' : 'player',
    });
    res.status(201).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ token: makeToken(user), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
