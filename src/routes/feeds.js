const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const feedsCtrl = require('../controllers/feeds');

router.get('/feed', auth.isAuthorized, feedsCtrl.getFeeds);

module.exports = router;
