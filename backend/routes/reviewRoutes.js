const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPlayers, createReview, getReceived } = require('../controllers/reviewController');

router.get('/players', protect, getPlayers);
router.get('/received', protect, getReceived);
router.post('/', protect, createReview);

module.exports = router;
