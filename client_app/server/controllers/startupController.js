const Startup = require('../models/Startup');
const User = require('../models/User');

// @desc    Get all startups (Approved & Active)
// @route   GET /api/startups
// @access  Public
exports.getStartups = async (req, res) => {
    try {
        // Filter by approved/active status
        // Allow admin to see all via query param? For now just approved for public browse
        const query = { status: { $in: ['approved', 'active'] } };

        // If user is admin (req.user potentially), might want to see all. 
        // But this is public route mostly.

        const startups = await Startup.find(query).populate('user', 'name bio email');
        res.status(200).json({ success: true, count: startups.length, data: startups });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get single startup
// @route   GET /api/startups/:id
// @access  Public
exports.getStartup = async (req, res) => {
    try {
        const startup = await Startup.findById(req.params.id).populate('user', 'name email stripePublishableKey');
        if (!startup) {
            return res.status(404).json({ success: false, error: 'Startup not found' });
        }
        res.status(200).json({ success: true, data: startup });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Create a startup profile
// @route   POST /api/startups
// @access  Private (Startup/Founder)
exports.createStartup = async (req, res) => {
    try {
        // Add user to body
        req.body.user = req.user.id;
        // Default status is pending (from model), but we can auto-approve for now or keep pending
        // Requirement: "Every newly posted startup must automatically appear" -> imply Auto-Approve or Active
        req.body.status = 'active';

        const startup = await Startup.create(req.body);
        res.status(201).json({ success: true, data: startup });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get startups for current user
// @route   GET /api/startups/me
// @access  Private
exports.getMyStartups = async (req, res) => {
    try {
        const startups = await Startup.find({ user: req.user.id });
        res.status(200).json({ success: true, count: startups.length, data: startups });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
