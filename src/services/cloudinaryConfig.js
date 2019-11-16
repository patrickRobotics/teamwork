const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dn2qodpsu',
    api_key: '114123853119164',
    api_secret: 'jwr7UnHVe4c0YXG4e7ct1VtSl3k'
});

exports.uploads = (file) => new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
        file,
        { folder: 'teamwork' },
        (error, result) => {
            if (error) {
                throw new Error(error);
            }
            resolve({ url: result.url, id: result.public_id });
        }
    );
});
