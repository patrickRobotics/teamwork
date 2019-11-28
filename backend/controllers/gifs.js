const jwt = require('jsonwebtoken');
const cloudinary = require('../services/cloudinaryConfig');

const { pool } = require('../services/db');

exports.createGif = async (req, res) => {
    let token = req.headers.token || req.headers.authorization;
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
                    const message = 'GIF image successfully posted';
                    Object.assign(result.rows[0], { message });
                    res.status(202).send({
                        status: 'success',
                        result: result.rows[0],
                    });
                }
            });
        });
    });
};

exports.updateGif = async (req, res) => {
    // eslint-disable-next-line radix
    const gifId = parseInt(req.params.id);
    let token = req.headers.token || req.headers.authorization;
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
            client.query(
                'UPDATE gifs SET title=$2, imageurl=$3, authorid=$4, publicId=$5 WHERE gifid = $1',
                [gifId, data.title, data.imageUrl, data.authorId, data.publicId],
                (error) => {
                    done();
                    if (error) {
                        res.status(400).json({
                            status: 'error',
                            error: 'An error occurred with your query',
                        });
                    } else {
                        res.status(202).send({
                            status: 'success',
                        });
                    }
                },
            );
        });
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
                    error: 'No gifs found',
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
    // eslint-disable-next-line radix
    const gifId = parseInt(req.params.id);
    pool.connect((err, client, done) => {
        const query = 'SELECT gifid AS id, title, imageurl, publicid, authorid, flagged, createdon FROM gifs WHERE gifid = $1';
        client.query(query, [gifId], (error, result) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'An error occurred with your query',
                });
            }
            if (result.rows < '1') {
                res.status(404).send({
                    status: 'error',
                    error: 'Gif with that id was not found',
                });
            } else {
                const query1 = 'SELECT commentid, authorid, comment FROM comments WHERE gifid = $1';
                client.query(query1, [gifId])
                    .then((data) => {
                        const comments = data.rows[0];
                        Object.assign(result.rows[0], { comments });
                        res.status(200).send({
                            status: 'success',
                            data: result.rows[0],
                        });
                        // eslint-disable-next-line no-console
                    }).catch((e) => console.log(e));
            }
        });
    });
};

exports.deleteGif = (req, res) => {
    // eslint-disable-next-line radix
    const gifId = parseInt(req.params.id);
    pool.connect((er, client, done) => {
        const query1 = 'SELECT publicid FROM gifs WHERE gifid = $1';
        client.query(query1, [gifId], (err, result) => {
            if (result.rows < '1') {
                res.status(404)
                    .send({
                        status: 'error',
                        error: 'Gif with that id was not found',
                    });
            }

            const publicId = result.rows[0].publicid;
            cloudinary.delete(publicId).then((results) => {
                const query = 'DELETE from gifs WHERE gifid = $1';
                client.query(query, [gifId], (error) => {
                    done();
                    if (error) {
                        res.status(400).json({
                            status: 'error',
                            error: 'An error occurred with your query',
                        });
                    } else {
                        res.status(200).send({
                            status: 'success',
                            data: { message: 'gif post successfully deleted' },
                        });
                    }
                });
            });
        });
    });
};

exports.gifComment = (req, res) => {
    // eslint-disable-next-line radix
    const gifId = parseInt(req.params.id);
    let token = req.headers.token || req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    const authData = jwt.verify(token, process.env.TOKEN_SECRET);
    const data = {
        authorId: authData.id,
        comment: req.body.comment,
    };
    pool.connect((err, client, done) => {
        const query = 'INSERT INTO comments(comment, gifid, authorid) VALUES($1,$2,$3) RETURNING *';
        const values = [data.comment, gifId, data.authorId];
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                // console.log(error);
                res.status(400).json({
                    status: 'error',
                    error: 'An error occurred with your query',
                });
            } else {
                const query1 = 'SELECT title, imageUrl FROM gifs WHERE gifid = $1';
                client.query(query1, [gifId])
                    .then((gifData) => {
                        const message = 'Comment successfully created';
                        const gifTitle = gifData.rows[0].title;
                        const imageUrl = gifData.rows[0].imageurl;
                        Object.assign(result.rows[0], { message, gifTitle, imageUrl });
                        res.status(200).send({
                            status: 'success',
                            data: result.rows[0],
                        });
                        // eslint-disable-next-line no-console
                    }).catch((e) => console.log(e));
            }
        });
    });
};
