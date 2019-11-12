const jwt = require('jsonwebtoken');

module.exports.isAuthorized = (req, res, next) => {
    try {
        let token = req.headers['x-access-token'] || req.headers.authorization;
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        // eslint-disable-next-line consistent-return
        jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 'error',
                    error: 'Invalid token',
                });
            }
            req.decoded = decoded;
            next();
        });
    } catch {
        res.status(401).json({
            status: 'error',
            error: 'No authentication data supplied',
        });
    }
};
