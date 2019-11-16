const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const routesCtrl = require('../controllers/posts');

router.post('/articles', auth.isAuthorized, routesCtrl.createPost);
router.put('/articles/:id', auth.isAuthorized, routesCtrl.updatePost);

router.get('/articles', auth.isAuthorized, routesCtrl.getPosts);
router.get('/articles/:id', auth.isAuthorized, routesCtrl.getPostById);

router.delete('/articles/:id', auth.isAuthorized, routesCtrl.deletePost);

module.exports = router;
