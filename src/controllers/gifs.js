const jwt = require('jsonwebtoken');
const cloudinary = require('../services/cloudinaryConfig');

const { pool } = require('../services/db');

exports.createGif = async (req, res) => {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    const authData = jwt.verify(token, process.env.TOKEN_SECRET);

    await cloudinary.uploads(req.file.path).then((imageData) => {
        const data = {
            title: req.file.filename,
            authorId: authData.id,
            imageUrl: imageData.url,
            publicId: imageData.id,
        };
        pool.connect((err, client, done) => {
            const query = 'INSERT INTO gifs(title, imageurl, authorid, publicId) VALUES($1,$2,$3,$4) RETURNING *';
            const values = [data.title, data.imageUrl, data.authorId, data.publicId];
            client.query(query, values, (error, result) => {
                done();
                if (error) {
                    res.status(400).json({
                        status: 'error',
                        error: 'An error occurred with your query',
                    });
                } else {
                    res.status(202).send({
                        status: 'success',
                        result: result.rows[0],
                    });
                }
            });
        });
    });
};

exports.updateGif = (req, res) => {
    res.status(400).json({
        status: 'error',
        error: 'An error occurred with your query',
    });
};

exports.getGifs = (req, res) => {
    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM gifs';
        client.query(query, (error, result) => {
            done();
            if (error) {
                res.status(400).json({ error });
            }
            if (result.rows < '1') {
                res.status(404).send({
                    status: 'error',
                    error: 'No posts found',
                });
            } else {
                res.status(200).send({
                    status: 'success',
                    data: result.rows,
                });
            }
        });
    });
};

exports.getGifsById = (req, res) => {
    res.status(400).json({
        status: 'error',
        error: 'An error occurred with your query',
    });
};

exports.deleteGif = (req, res) => {
    res.status(400).json({
        status: 'error',
        error: 'An error occurred with your query',
    });
};
