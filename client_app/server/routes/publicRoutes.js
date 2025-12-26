const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const User = require('../models/User');
const Startup = require('../models/Startup');

// @route   GET /api/public/stats
// @desc    Get global platform statistics
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        // 1. Capital Deployed (Total amount in Applications)
        // Aggregation is better for large datasets, but simple reduce is fine for MVP
        const applications = await Application.find();
        const capitalDeployed = applications.reduce((sum, app) => sum + (app.amount || 0), 0);

        // 2. Active Investors (Count of users with role 'investor')
        const activeInvestors = await User.countDocuments({ role: 'investor' });

        // 3. Startups Info (Count of Startup profiles)
        const startupsInfo = await Startup.countDocuments();

        res.json({
            success: true,
            data: {
                capitalDeployed,
                activeInvestors,
                startupsInfo
            }
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

module.exports = router;
