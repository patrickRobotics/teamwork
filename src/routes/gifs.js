const express = require('express');
const multer = require('../services/multerConfig');

const router = express.Router();

const auth = require('../middleware/auth');

const gifsCtrl = require('../controllers/gifs');

router.post('/gifs', auth.isAuthorized, multer, gifsCtrl.createGif);
router.put('/gifs/:id', auth.isAuthorized, multer, gifsCtrl.updateGif);

router.get('/gifs', auth.isAuthorized, gifsCtrl.getGifs);
router.get('/gifs/:id', auth.isAuthorized, gifsCtrl.getGifsById);

router.delete('/gifs/:id', auth.isAuthorized, gifsCtrl.deleteGif);

router.post('/gifs/:id/comment', auth.isAuthorized, gifsCtrl.gifComment);

module.exports = router;
