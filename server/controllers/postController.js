const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');
const { sendNotification } = require('../services/notificationService');

exports.createPost = async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            author: req.user._id
        });
        await post.save();
        res.status(201).send(post);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username name avatarUrl')
            .populate({
                path: 'likes',
                select: 'username name avatarUrl'
            });

        if (!post) {
            return res.status(404).send();
        }
        res.send(post);
    } catch (e) {
        res.status(500).send();
    }
};

exports.getFeed = async (req, res) => {
    try {
        // Posts from followed users + own posts
        const following = req.user.following;
        const posts = await Post.find({
            author: { $in: [...following, req.user._id] }
        })
            .sort({ createdAt: -1 })
            .populate('author', 'username name avatarUrl')
            .limit(20);

        res.send(posts);
    } catch (e) {
        res.status(500).send();
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send();

        const isLiked = post.likes.includes(req.user._id);

        if (isLiked) {
            post.likes = post.likes.filter(id => !id.equals(req.user._id));
        } else {
            post.likes.push(req.user._id);

            // Create notification
            if (!post.author.equals(req.user._id)) {
                const notification = new Notification({
                    recipient: post.author,
                    type: 'like',
                    sourceUser: req.user._id,
                    post: post._id
                });
                await notification.save();
            }
        }

        await post.save();
        res.send({ liked: !isLiked });
    } catch (e) {
        res.status(500).send();
    }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).send();

        const comment = new Comment({
            text: req.body.text,
            author: req.user._id,
            post: post._id
        });

        await comment.save();

        post.commentsCount += 1;
        await post.save();

        // Notification
        if (!post.author.equals(req.user._id)) {
            await sendNotification(post.author, 'comment', req.user._id, post._id);
        }

        res.status(201).send(comment);
    } catch (e) {
        res.status(400).send(e);
    }
};

exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', 'username name avatarUrl')
            .sort({ createdAt: -1 });
        res.send(comments);
    } catch (e) {
        res.status(500).send();
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.id, author: req.user._id });
        if (!post) return res.status(404).send();

        // Also delete comments
        await Comment.deleteMany({ post: post._id });

        res.send(post);
    } catch (e) {
        res.status(500).send();
    }
};

exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.id })
            .sort({ createdAt: -1 })
            .populate('author', 'username name avatarUrl');
        res.send(posts);
    } catch (e) {
        res.status(500).send();
    }
};
