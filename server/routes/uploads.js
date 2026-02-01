const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');

router.post('/', auth, upload.array('images', 5), (req, res) => {
    try {
        const filePaths = req.files.map(file => `/uploads/${file.filename}`);
        res.send({ urls: filePaths });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
