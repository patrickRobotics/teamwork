const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const routesCtrl = require('../controllers/posts');

router.post('/posts', auth.isAuthorized, routesCtrl.createPost);
router.put('/posts/:id', auth.isAuthorized, routesCtrl.updatePost);

router.get('/posts', auth.isAuthorized, routesCtrl.getPosts);
router.get('/posts/:id', auth.isAuthorized, routesCtrl.getPostById);

router.delete('/posts/:id', auth.isAuthorized, routesCtrl.deletePost);

module.exports = router;
