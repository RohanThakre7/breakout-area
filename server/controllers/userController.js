const User = require('../models/User');
const { sendNotification } = require('../services/notificationService');

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'username avatarUrl')
            .populate('following', 'username avatarUrl');

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'bio', 'avatarUrl'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) {
            return res.status(404).send({ error: 'User not found' });
        }

        if (userToFollow._id.equals(req.user._id)) {
            return res.status(400).send({ error: 'You cannot follow yourself' });
        }

        const isFollowing = req.user.following.includes(userToFollow._id);

        if (isFollowing) {
            // Unfollow
            req.user.following = req.user.following.filter(id => !id.equals(userToFollow._id));
            userToFollow.followers = userToFollow.followers.filter(id => !id.equals(req.user._id));
        } else {
            // Follow
            req.user.following.push(userToFollow._id);
            userToFollow.followers.push(req.user._id);
            await sendNotification(userToFollow._id, 'follow', req.user._id);
        }

        await req.user.save();
        await userToFollow.save();

        res.send({ following: !isFollowing });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

exports.getSuggestions = async (req, res) => {
    try {
        // Find users not in the current user's following list and not the user themselves
        const users = await User.find({
            _id: { $nin: [...req.user.following, req.user._id] }
        })
            .select('username name avatarUrl bio')
            .limit(5);

        res.send(users);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};

exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.send([]);

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        }).select('username name avatarUrl bio').limit(10);

        res.send(users);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
};
