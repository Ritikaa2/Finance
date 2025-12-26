const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    startup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Startup',
        required: true,
    },
    investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The investor
        required: true,
    },
    type: {
        type: String,
        enum: ['equity', 'debt', 'grant'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'negotiating'],
        default: 'pending',
    },
    message: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Application', ApplicationSchema);
