const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const gifsCtrl = require('../controllers/gifs');

router.post('/gifs', auth.isAuthorized, gifsCtrl.createGif);
router.put('/gifs/:id', auth.isAuthorized, gifsCtrl.updateGif);

router.get('/gifs', auth.isAuthorized, gifsCtrl.getGifs);
router.get('/gifs/:id', auth.isAuthorized, gifsCtrl.getGifsById);

router.delete('/gifs/:id', auth.isAuthorized, gifsCtrl.deleteGif);

module.exports = router;
