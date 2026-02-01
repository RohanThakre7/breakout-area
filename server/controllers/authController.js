const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const user = new User({ name, username, email, password });
        await user.save();

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }

        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
};

exports.me = async (req, res) => {
    res.send(req.user);
};
