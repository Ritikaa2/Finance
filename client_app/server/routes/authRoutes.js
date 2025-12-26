const express = require('express');
const { register, login, getMe, forgotPassword, verifyOtp, resetPassword, verifyRegistrationOtp, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/register/verify', verifyRegistrationOtp);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.post('/verifyotp', verifyOtp);
router.put('/resetpassword', resetPassword);
console.log('Auth Routes Loaded');
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
