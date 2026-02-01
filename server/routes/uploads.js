const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
const logger = require('../utils/logger');

router.post('/', (req, res, next) => {
    logger.info('[DEBUG] Upload route hit - checking auth...');
    next();
}, auth, (req, res, next) => {
    logger.info('[DEBUG] Auth passed - starting upload...');
    upload.array('images', 5)(req, res, (err) => {
        if (err) {
            logger.error('Multer error:', err);
            return res.status(400).send({ error: err.message });
        }

        if (!req.files || req.files.length === 0) {
            logger.warn('No files received in upload request');
            return res.status(400).send({ error: 'No files uploaded' });
        }

        try {
            // With Cloudinary storage, file.path contains the secure URL
            const filePaths = req.files.map(file => file.path);
            logger.info(`Uploaded files to Cloudinary: ${filePaths.join(', ')}`);
            res.send({ urls: filePaths });
        } catch (error) {
            logger.error('Upload processing error:', error);
            res.status(400).send({ error: error.message });
        }
    });
});

module.exports = router;
