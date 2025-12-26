const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Simple Admin Controllers inline for now
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const verifyUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/verify/:id', verifyUser);

module.exports = router;
