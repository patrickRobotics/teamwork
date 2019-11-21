const jwt = require('jsonwebtoken');
const { pool } = require('../services/db');

module.exports.isAdmin = (req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
    }
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    pool.connect((err, client, done) => {
        const query = 'SELECT userId, is_admin FROM users WHERE userId = $1';
        client.query(query, [data.id], (error, result) => {
            done();
            if (result.rows[0].is_admin === true) {
                next();
            } else {
                res.status(401).send({
                    status: 'error',
                    error: 'You are not authorized to perform this operation',
                });
            }
        });
    });
};
