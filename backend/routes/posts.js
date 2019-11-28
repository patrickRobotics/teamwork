const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const postsCtrl = require('../controllers/posts');

router.post('/articles', auth.isAuthorized, postsCtrl.createPost);
router.put('/articles/:id', auth.isAuthorized, postsCtrl.updatePost);

router.get('/articles', auth.isAuthorized, postsCtrl.getPosts);
router.get('/articles/:id', auth.isAuthorized, postsCtrl.getPostById);

router.delete('/articles/:id', auth.isAuthorized, postsCtrl.deletePost);

router.post('/articles/:id/comment', auth.isAuthorized, postsCtrl.postComment);

module.exports = router;
