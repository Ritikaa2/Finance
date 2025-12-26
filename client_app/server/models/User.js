const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['startup', 'investor', 'admin'],
        default: 'startup',
    },
    membershipType: {
        type: String,
        enum: ['Basic', 'Pro', 'Institutional'],
        default: 'Basic'
    },
    membershipExpiry: {
        type: Date
    },
    bio: String,
    location: String,
    phone: String,
    stripeConnectId: {
        type: String,
    },
    stripeSecretKey: {
        type: String,
    },
    stripePublishableKey: {
        type: String,
    },
    razorpayKeyId: {
        type: String,
    },
    razorpayKeySecret: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
