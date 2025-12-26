const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// @route   POST /api/applications
// @desc    Submit a financing application
// @access  Private (Startup)
router.post('/', async (req, res) => {
    try {
        const application = await Application.create(req.body);
        res.status(201).json({ success: true, data: application });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @route   GET /api/applications
// @desc    Get applications (filtered by startup or investor)
// @access  Private
router.get('/', async (req, res) => {
    try {
        // Basic filter example
        const filter = {};
        if (req.query.startupId) filter.startup = req.query.startupId;
        if (req.query.investorId) filter.investor = req.query.investorId;

        const applications = await Application.find(filter)
            .populate('startup', 'companyName')
            .populate('investor', 'name');

        res.status(200).json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   GET /api/applications/stats
// @desc    Get dashboard stats for a user (investor)
// @access  Private
router.get('/stats', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, error: "User ID required" });

        // Total Investment
        const applications = await Application.find({ investor: userId });
        const totalInvestment = applications.reduce((sum, app) => sum + (app.amount || 0), 0);

        // Active Startups (Unique count)
        const uniqueStartups = new Set(applications.map(app => app.startup.toString()));
        const activeStartups = uniqueStartups.size;

        // Recent Activity (Last 5)
        const recentApplications = await Application.find({ investor: userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('startup', 'companyName');

        const activityLog = recentApplications.map(app => ({
            id: app._id,
            text: `Invested ${app.amount} in ${app.startup.companyName}`,
            time: app.createdAt,
            type: 'investment'
        }));

        res.json({
            success: true,
            data: {
                totalInvestment,
                activeStartups,
                portfolioGrowth: 0, // Placeholder as we don't track history yet
                profileViews: 0,    // Placeholder
                recentActivity: activityLog
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
