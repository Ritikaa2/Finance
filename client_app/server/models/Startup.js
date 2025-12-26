const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    industry: {
        type: String,
        required: true,
    },
    stage: {
        type: String, // e.g., Seed, Series A
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'active'],
        default: 'pending' // pending approval
    },
    location: String,
    website: String,
    fundingGoal: {
        type: Number,
        required: true,
    },
    raisedAmount: {
        type: Number,
        default: 0,
    },
    pitchDeckUrl: String, // Link to PDF or slide
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Startup', StartupSchema);
