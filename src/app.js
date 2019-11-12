const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/', postsRoutes);

module.exports = app;
