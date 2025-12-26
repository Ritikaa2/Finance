const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// @route   GET /api/messages
// @desc    Get messages for a user (or between two users)
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ success: false, error: 'User ID required' });

        // Simple chat: get all messages where user is sender OR receiver (if we had receiver ID)
        // For MVP, just fetching all messages to simulate a global chat or specific thread
        const messages = await Message.find()
            .populate('sender', 'name')
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { sender, text, receiver } = req.body;
        const message = await Message.create({ sender, text, receiver });
        // Populate immediately to return full object
        await message.populate('sender', 'name');

        // Socket.io Emit
        const io = req.app.get('io');
        io.emit('receive_message', message); // Broadcast to everyone for MVP global chat

        res.status(201).json({ success: true, data: message });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

module.exports = router;
