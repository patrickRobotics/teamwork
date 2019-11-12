const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const routesCtrl = require('../controllers/posts');

router.post('/posts', auth.isAuthorized, routesCtrl.createPost);

router.get('/posts', auth.isAuthorized, routesCtrl.getPosts);

module.exports = router;
