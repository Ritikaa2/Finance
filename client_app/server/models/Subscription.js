const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    stripeSubscriptionId: String,
    plan: {
        type: String,
        required: true,
    },
    status: {
        type: String, // active, past_due, canceled
    },
    currentPeriodEnd: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
