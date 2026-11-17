const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // adjust to your teammate's UC 1 file and export name
const { createMatch, getMyMatches, updateMatch, cancelMatch } = require('../controllers/matchController');

router.post('/', protect, createMatch);
router.get('/mine', protect, getMyMatches);
router.put('/:id', protect, updateMatch);
router.delete('/:id', protect, cancelMatch);

module.exports = router;
