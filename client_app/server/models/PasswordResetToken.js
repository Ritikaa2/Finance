const mongoose = require('mongoose');

const PasswordResetTokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // Token expires in 1 hour
    },
});

module.exports = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
