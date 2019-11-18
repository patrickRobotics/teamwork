const { pool } = require('../services/db');

exports.getFeeds = (req, res) => {
    pool.connect((err, client, done) => {
        const query = {
            text: 'SELECT id, title as title, article, authorid, createdon FROM posts GROUP BY id '
                + 'UNION ALL SELECT id, title, imageurl, authorid, createdon FROM gifs GROUP BY id'
        };
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
