const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
    getOpenMatches,
    joinMatch
} = require('../controllers/matchController');

// Get all open matches
router.get('/', protect, getOpenMatches);

// Join an open match
router.post('/:id/join', protect, joinMatch);

module.exports = router;