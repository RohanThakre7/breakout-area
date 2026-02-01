const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');

router.post('/', auth, postController.createPost);
router.get('/feed', auth, postController.getFeed);
router.get('/:id', postController.getPost);
router.delete('/:id', auth, postController.deletePost);
router.put('/:id', auth, postController.updatePost);
router.post('/:id/like', auth, postController.likePost);
router.post('/:id/comment', auth, postController.addComment);
router.get('/:id/comments', postController.getComments);
router.get('/user/:id', postController.getUserPosts);

module.exports = router;
