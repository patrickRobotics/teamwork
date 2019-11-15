const { pool } = require('../services/db');

exports.createGif = (req, res) => {
    const data = {
        title: req.body.title,
        url: req.body.imageUrl,
        authorId: req.body.authorId,
    };
    pool.connect((err, client, done) => {
        const query = 'INSERT INTO gifs(title, imageurl, authorid) VALUES($1,$2,$3) RETURNING *';
        const values = [data.title, data.url, data.authorId];
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
};

exports.updateGif = (req, res) => {
    res.status(400).json({
        status: 'error',
        error: 'An error occurred with your query',
    });
};

exports.getGifs = (req, res) => {
    res.status(400).json({
        status: 'error',
        error: 'An error occurred with your query',
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
