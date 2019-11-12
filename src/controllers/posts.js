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

exports.createPost = (req, res) => {
    const data = {
        articleTitle: req.body.articleTitle,
        article: req.body.article,
        authorId: 3,
    };
    pool.connect((err, client, done) => {
        const query = 'INSERT INTO posts(articleTitle, article, authorId) VALUES($1,$2,$3) RETURNING *';
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