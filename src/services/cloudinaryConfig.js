const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
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
