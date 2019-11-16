const { pool } = require('../services/db');

exports.getPosts = (req, res) => {
    pool.connect((err, client, done) => {
        const query = 'SELECT * FROM posts';
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

exports.getPostById = (req, res) => {
    // eslint-disable-next-line radix
    const postId = parseInt(req.params.id);
    pool.connect((err, client, done) => {
        const query = 'SELECT id, articletitle, article, authorid, flagged, createdon FROM posts WHERE id = $1';
        client.query(query, [postId], (error, result) => {
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
                    error: 'Article with that id was not found',
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

exports.createPost = (req, res) => {
    const data = {
        articleTitle: req.body.articleTitle,
        article: req.body.article,
        authorId: req.body.authorId,
    };
    pool.connect((err, client, done) => {
        const query = 'INSERT INTO posts(articletitle, article, authorid) VALUES($1,$2,$3) RETURNING *';
        const values = [data.articleTitle, data.article, data.authorId];
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

exports.updatePost = (req, res) => {
    // eslint-disable-next-line radix
    const postId = parseInt(req.params.id);
    const data = {
        articleTitle: req.body.articleTitle,
        article: req.body.article,
        authorId: req.body.authorId,
    };
    pool.connect((err, client, done) => {
        client.query(
            'UPDATE posts SET articletitle=$2, article=$3, authorid=$4 WHERE id = $1',
            [postId, data.articleTitle, data.article, data.authorId],
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
};

exports.deletePost = (req, res) => {
    // eslint-disable-next-line radix
    const postId = parseInt(req.params.id);
    pool.connect((er, client, done) => {
        const query = 'DELETE from posts WHERE id = $1';
        client.query(query, [postId], (error) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'An error occurred with your query',
                });
            } else {
                res.status(200).send({
                    status: 'success',
                });
            }
        });
    });
};
