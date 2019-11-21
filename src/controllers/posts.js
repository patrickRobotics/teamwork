const jwt = require('jsonwebtoken');
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
        const query = 'SELECT articleId, title, article, authorid, flagged, createdon FROM posts WHERE articleId = $1';
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
                const query1 = 'SELECT commentId, authorid, comment FROM comments WHERE postid = $1';
                client.query(query1, [postId])
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

exports.createPost = (req, res) => {
    let token = req.headers.token || req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    const authData = jwt.verify(token, process.env.TOKEN_SECRET);
    const data = {
        title: req.body.title,
        article: req.body.article,
        authorId: authData.id,
    };
    pool.connect((err, client, done) => {
        const query = 'INSERT INTO posts(title, article, authorid) VALUES($1,$2,$3) RETURNING *';
        const values = [data.title, data.article, data.authorId];
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'An error occurred with your query',
                });
            } else {
                const message = 'Article successfully posted';
                Object.assign(result.rows[0], { message });
                res.status(202).send({
                    status: 'success',
                    data: result.rows[0],
                });
            }
        });
    });
};

exports.updatePost = (req, res) => {
    // eslint-disable-next-line radix
    const postId = parseInt(req.params.id);
    let token = req.headers.token || req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    const authData = jwt.verify(token, process.env.TOKEN_SECRET);
    const data = {
        title: req.body.title,
        article: req.body.article,
        authorId: authData.id,
    };
    pool.connect((err, client, done) => {
        client.query(
            'UPDATE posts SET title=$2, article=$3, authorid=$4 WHERE articleId = $1',
            [postId, data.title, data.article, data.authorId],
            (error) => {
                if (error) {
                    res.status(400).json({
                        status: 'error',
                        error: 'An error occurred with your query',
                    });
                } else {
                    const message = 'Article successfully updated';
                    const queryResult = 'SELECT articleId, title, article, authorid, flagged, createdon FROM posts WHERE articleId = $1';
                    client.query(queryResult, [postId]).then((responseData) => {
                        Object.assign(responseData.rows[0], { message });
                        res.status(200).send({
                            status: 'success',
                            data: responseData.rows[0],
                        });
                        // eslint-disable-next-line no-console
                    }).catch((e) => console.log(e));
                    done();
                }
            },
        );
    });
};

exports.deletePost = (req, res) => {
    // eslint-disable-next-line radix
    const postId = parseInt(req.params.id);
    pool.connect((er, client, done) => {
        const query = 'DELETE from posts WHERE articleId = $1';
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
                    data: { message: 'Article successfully deleted' },
                });
            }
        });
    });
};

exports.postComment = (req, res) => {
    // eslint-disable-next-line radix
    const postId = parseInt(req.params.id);
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
        const query = 'INSERT INTO comments(comment, postid, authorid) VALUES($1,$2,$3) RETURNING *';
        const values = [data.comment, postId, data.authorId];
        client.query(query, values, (error, result) => {
            done();
            if (error) {
                res.status(400).json({
                    status: 'error',
                    error: 'An error occurred with your query',
                });
            } else {
                const message = 'Comment successfully created';
                Object.assign(result.rows[0], { message });
                res.status(202).send({
                    status: 'success',
                    data: result.rows[0],
                });
            }
        });
    });
};
