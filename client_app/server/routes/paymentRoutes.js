const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/create-order', authorize('investor', 'startup'), createOrder);
router.post('/verify-payment', authorize('investor', 'startup'), verifyPayment);

module.exports = router;
