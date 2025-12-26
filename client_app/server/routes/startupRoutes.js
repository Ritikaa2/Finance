const express = require('express');
const { getStartups, getStartup, createStartup, getMyStartups } = require('../controllers/startupController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getStartups);
router.get('/me', protect, getMyStartups);
router.get('/:id', getStartup);
router.post('/', protect, authorize('startup', 'admin'), createStartup); // Startup role required

module.exports = router;
