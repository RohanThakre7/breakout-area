const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/search', userController.searchUsers);
router.get('/:id', userController.getProfile);
router.put('/me', auth, userController.updateProfile);
router.post('/follow/:id', auth, userController.followUser);

module.exports = router;
