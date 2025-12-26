const Investment = require('../models/Investment');

// @desc    Get my investments (Portfolio)
// @route   GET /api/investments
// @access  Private
exports.getInvestments = async (req, res) => {
    try {
        const investments = await Investment.find({ investor: req.user.id })
            .populate('startup', 'companyName industry stage')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: investments.length, data: investments });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get analytics/stats for user
// @route   GET /api/investments/stats
// @access  Private
exports.getInvestmentStats = async (req, res) => {
    try {
        const investments = await Investment.find({ investor: req.user.id })
            .populate('startup', 'companyName industry');

        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
        const activeAllocations = investments.length;

        // Group by month
        const monthlyData = new Array(12).fill(0).map((_, i) => ({
            name: new Date(0, i).toLocaleString('default', { month: 'short' }),
            value: 0
        }));

        const diversityMap = {};

        investments.forEach(inv => {
            // Monthly Data
            const date = new Date(inv.createdAt);
            const month = date.getMonth();
            monthlyData[month].value += inv.amount;

            // Diversity Data
            if (inv.startup && inv.startup.industry) {
                const industry = inv.startup.industry;
                if (!diversityMap[industry]) {
                    diversityMap[industry] = 0;
                }
                diversityMap[industry] += inv.amount;
            }
        });

        const portfolioDiversity = Object.keys(diversityMap).map(industry => ({
            name: industry,
            value: diversityMap[industry]
        }));

        res.status(200).json({
            success: true,
            data: {
                totalInvested,
                activeAllocations,
                monthlyData,
                portfolioDiversity
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
