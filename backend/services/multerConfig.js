const multer = require('multer');


const MIME_TYPES = {
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_').split('.')[0];
        const extension = MIME_TYPES[file.mimetype];
        callback(
            null, `${name + Date.now()}.${extension}`
        );
    }
});

module.exports = multer({ storage }).single('image');
