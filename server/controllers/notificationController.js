const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sourceUser', 'username avatarUrl')
            .populate('post', 'text')
            .sort({ createdAt: -1 })
            .limit(50);
        res.send(notifications);
    } catch (e) {
        res.status(500).send();
    }
};

exports.markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.send({ success: true });
    } catch (e) {
        res.status(500).send();
    }
};
