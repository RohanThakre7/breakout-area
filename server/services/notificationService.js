const Notification = require('../models/Notification');

let io;

const setIo = (_io) => {
    io = _io;
};

const sendNotification = async (recipientId, type, sourceId, postId = null) => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            type,
            sourceUser: sourceId,
            post: postId
        });

        await notification.save();

        const populated = await Notification.findById(notification._id)
            .populate('sourceUser', 'username avatarUrl')
            .populate('post', 'text');

        if (io) {
            io.to(recipientId.toString()).emit('notification:new', populated);
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = { setIo, sendNotification };
