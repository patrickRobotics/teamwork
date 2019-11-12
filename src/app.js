const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/users');

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    }),
);

app.use('/api/v1/auth', userRoutes);

module.exports = app;
