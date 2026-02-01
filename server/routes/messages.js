const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middlewares/auth');
const { getIo } = require('../services/notificationService');

// Get conversation with a specific user
router.get('/conversation/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { sender: req.user._id, recipient: req.params.userId },
                { sender: req.params.userId, recipient: req.user._id }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'name username avatarUrl')
            .populate('recipient', 'name username avatarUrl');

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Send a message
router.post('/send/:recipientId', auth, async (req, res) => {
    try {
        console.log('--- SEND MESSAGE REQUEST ---');
        console.log('Sender:', req.user._id);
        console.log('Recipient:', req.params.recipientId);
        console.log('Body:', req.body);

        const { text } = req.body;
        const recipientId = req.params.recipientId;

        if (!text) {
            console.log('Error: Message text is required');
            return res.status(400).json({ error: 'Message text is required' });
        }

        const message = new Message({
            sender: req.user._id,
            recipient: recipientId,
            text
        });

        await message.save();
        console.log('Message saved to DB:', message._id);

        const populatedMessage = await message.populate('sender', 'name username avatarUrl');
        console.log('Message populated');

        // Socket.io emission
        const io = getIo();
        if (io) {
            console.log(`Emitting receive_message to room: ${recipientId}`);
            io.to(recipientId).emit('receive_message', populatedMessage);
        } else {
            console.error('Socket.io instance not found!');
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Send Check Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get list of followed users for messaging
router.get('/contacts', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('following', 'name username avatarUrl');
        res.json(user.following);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Mark messages as read
router.post('/read/:senderId', auth, async (req, res) => {
    try {
        await Message.updateMany(
            { sender: req.params.senderId, recipient: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
