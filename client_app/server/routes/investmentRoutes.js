const express = require('express');
const { getInvestments, getInvestmentStats } = require('../controllers/investmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/', getInvestments);
router.get('/stats', getInvestmentStats);

module.exports = router;
