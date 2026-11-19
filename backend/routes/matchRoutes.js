const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
    getOpenMatches,
    joinMatch,
    createMatch
} = require('../controllers/matchController');

// Get all open matches
router.get('/', protect, getOpenMatches);
// Create an open match
router.post('/', protect, createMatch);

// Join an open match
router.post('/:id/join', protect, joinMatch);

module.exports = router;